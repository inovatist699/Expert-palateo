#!/usr/bin/env python3
# Copyright 2026 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""OmniRoute Gateway Client.

Provides a unified interface to the local OmniRoute AI gateway
(http://localhost:20128/v1), utilizing native model routing, multi-provider API keys,
and automatic failover when usage or rate limits are reached.
"""

import argparse
import json
import os
import shutil
import subprocess
import sys
import time
from urllib import error as urllib_error
from urllib import parse as urllib_parse
from urllib import request as urllib_request


class RateLimitError(Exception):
    """Raised when all OmniRoute routes and upstream providers hit quota/rate limits."""


class OmniRouteClient:
    """Client for communicating with the OmniRoute AI gateway."""

    def __init__(self, base_url="http://localhost:20128/v1", api_key=None, requests_per_second=10):
        self.base_url = base_url.rstrip("/")
        self.api_key = api_key or os.environ.get("OMNIROUTE_API_KEY", "sk-250daa1c27d0a19c-4d9abe-e991e759")
        self.delay = 1.0 / requests_per_second
        self.last_request_time = 0.0

    def _wait_for_rate_limit(self):
        """Monotonic rate-limit pacing between gateway calls."""
        elapsed = time.monotonic() - self.last_request_time
        if elapsed < self.delay:
            time.sleep(self.delay - elapsed)

    def _request(self, path, method="GET", payload=None, retries=3):
        """Sends an HTTP request with exponential backoff on transient errors."""
        url = f"{self.base_url}{path}"
        data = None
        headers = {
            "Accept": "application/json",
            "User-Agent": "omniroute-gateway-skill/1.0",
        }
        if self.api_key:
            headers["Authorization"] = f"Bearer {self.api_key}"

        if payload is not None:
            data = json.dumps(payload).encode("utf-8")
            headers["Content-Type"] = "application/json"

        for attempt in range(retries):
            self._wait_for_rate_limit()
            try:
                req = urllib_request.Request(url, data=data, headers=headers, method=method)
                with urllib_request.urlopen(req, timeout=120) as response:
                    self.last_request_time = time.monotonic()
                    body = response.read().decode("utf-8")
                    return json.loads(body)
            except urllib_error.HTTPError as e:
                self.last_request_time = time.monotonic()
                error_body = ""
                try:
                    error_body = e.read().decode("utf-8", errors="replace")[:2000]
                except OSError:
                    error_body = str(e.reason)

                if e.code == 429:
                    wait = 2 ** (attempt + 1)
                    print(
                        f"[OmniRoute] Rate limit/quota warning (429), retrying in {wait}s "
                        f"(attempt {attempt + 1}/{retries})...",
                        file=sys.stderr,
                    )
                    if attempt == retries - 1:
                        raise RateLimitError(
                            f"HTTP 429 Too Many Requests from OmniRoute ({url}). "
                            f"All upstream models/providers may have exhausted their quota: {error_body}"
                        ) from e
                    time.sleep(wait)
                    continue

                if e.code >= 500:
                    wait = 2 ** attempt
                    print(
                        f"[OmniRoute] Server error {e.code}, retrying in {wait}s "
                        f"(attempt {attempt + 1}/{retries})...",
                        file=sys.stderr,
                    )
                    if attempt == retries - 1:
                        raise RuntimeError(
                            f"Server error {e.code} from {url} after {retries} retries: {error_body}"
                        ) from e
                    time.sleep(wait)
                    continue

                raise RuntimeError(f"HTTP {e.code} from {url}: {error_body}") from e
            except urllib_error.URLError as e:
                if attempt == retries - 1:
                    raise RuntimeError(
                        f"Failed to reach OmniRoute gateway at {url} after {retries} attempts: {e.reason}. "
                        "Ensure OmniRoute is running on port 20128 (run 'start' subcommand)."
                    ) from e
                time.sleep(2 ** attempt)

        raise RuntimeError(f"Request failed after {retries} attempts.")

    def get_status(self):
        """Checks gateway connectivity and fetches available models."""
        try:
            res = self._request("/models", method="GET", retries=2)
            models = res.get("data", [])
            return {
                "online": True,
                "base_url": self.base_url,
                "model_count": len(models),
                "models": [m.get("id") for m in models if isinstance(m, dict)],
                "raw_response": res,
            }
        except Exception as e:
            return {
                "online": False,
                "base_url": self.base_url,
                "error": str(e),
                "suggestion": "Run 'uv run scripts/omniroute_client.py start' or start OmniRoute using 'npx omniroute'.",
            }

    def start_gateway(self, port=20128):
        """Checks port status and provides launch management."""
        status = self.get_status()
        if status.get("online"):
            return {
                "status": "already_running",
                "port": port,
                "base_url": self.base_url,
                "message": f"OmniRoute is already active and responsive at {self.base_url}.",
            }

        node_path = shutil.which("node")
        server_cjs = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../scripts/omniroute_server.cjs"))

        if node_path and os.path.exists(server_cjs):
            cmd_used = [node_path, server_cjs]
        elif omniroute_path:
            cmd_used = [omniroute_path]
        elif npx_path:
            cmd_used = [npx_path, "omniroute"]

        if not cmd_used:
            return {
                "status": "missing_binary",
                "error": "Neither 'omniroute' nor 'npx' was found in PATH.",
                "instruction": "Please install Node.js / npm or run 'npm install -g omniroute' or run OmniRoute via Docker.",
            }

        try:
            # Spawn OmniRoute as a decoupled background process
            proc = subprocess.Popen(
                cmd_used,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
                start_new_session=True if os.name != "nt" else False,
                creationflags=subprocess.CREATE_NEW_PROCESS_GROUP if os.name == "nt" else 0,
            )
            # Give it a short moment to initialize
            time.sleep(3)
            current_status = self.get_status()

            return {
                "status": "started" if current_status.get("online") else "spawned_initializing",
                "pid": proc.pid,
                "port": port,
                "command": " ".join(cmd_used),
                "current_status": current_status,
            }
        except Exception as e:
            return {
                "status": "launch_failed",
                "error": str(e),
                "manual_command": "npx omniroute",
            }

    def complete(
        self,
        prompt=None,
        prompt_file=None,
        model="auto",
        system_prompt=None,
        temperature=0.7,
        max_tokens=None,
    ):
        """Sends chat completion request through OmniRoute with automated model failover."""
        user_content = ""
        if prompt_file:
            with open(prompt_file, "r", encoding="utf-8") as f:
                user_content = f.read()
        elif prompt:
            user_content = prompt
        else:
            raise ValueError("Either --prompt or --prompt-file must be provided.")

        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": user_content})

        payload = {
            "model": model,
            "messages": messages,
            "temperature": temperature,
        }
        if max_tokens:
            payload["max_tokens"] = max_tokens

        res = self._request("/chat/completions", method="POST", payload=payload, retries=3)

        choices = res.get("choices", [])
        content = ""
        if choices and "message" in choices[0]:
            content = choices[0]["message"].get("content", "")

        served_model = res.get("model", model)
        print(f"[OmniRoute] Response successfully generated by model: {served_model}", file=sys.stderr)

        return {
            "content": content,
            "served_model": served_model,
            "requested_model": model,
            "usage": res.get("usage", {}),
            "raw_response": res,
        }


def write_output(data, output_file):
    """Writes output dictionary to JSON file."""
    try:
        os.makedirs(os.path.dirname(os.path.abspath(output_file)), exist_ok=True)
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
        print(f"Success! Data written to: {output_file}")
    except (OSError, TypeError) as e:
        print(f"Error writing to file {output_file}: {e}", file=sys.stderr)
        sys.exit(1)


def main():
    parser = argparse.ArgumentParser(
        description="OmniRoute Gateway CLI: Unified AI access with automatic failover."
    )
    subparsers = parser.add_subparsers(dest="command", required=True)

    # Subcommand: status
    p_status = subparsers.add_parser("status", help="Check gateway connectivity and available models")
    p_status.add_argument(
        "--base-url",
        default="http://localhost:20128/v1",
        help="OmniRoute API base URL (default: http://localhost:20128/v1)",
    )
    p_status.add_argument("--output", required=True, help="Output JSON file path")

    # Subcommand: start
    p_start = subparsers.add_parser("start", help="Start or verify local OmniRoute gateway instance")
    p_start.add_argument(
        "--port",
        type=int,
        default=20128,
        help="Port for OmniRoute instance (default: 20128)",
    )
    p_start.add_argument(
        "--base-url",
        default="http://localhost:20128/v1",
        help="OmniRoute API base URL (default: http://localhost:20128/v1)",
    )
    p_start.add_argument("--output", required=True, help="Output JSON file path")

    # Subcommand: complete
    p_complete = subparsers.add_parser(
        "complete",
        help="Generate completion using OmniRoute with automatic next-best model failover",
    )
    p_complete.add_argument("--prompt", help="Direct prompt string")
    p_complete.add_argument("--prompt-file", help="Path to file containing prompt text")
    p_complete.add_argument(
        "--model",
        default="auto",
        help="Target model or routing alias (default: 'auto' for smart routing)",
    )
    p_complete.add_argument("--system-prompt", help="System prompt / instructions")
    p_complete.add_argument(
        "--temperature",
        type=float,
        default=0.7,
        help="Sampling temperature (default: 0.7)",
    )
    p_complete.add_argument("--max-tokens", type=int, help="Maximum completion tokens")
    p_complete.add_argument(
        "--base-url",
        default="http://localhost:20128/v1",
        help="OmniRoute API base URL (default: http://localhost:20128/v1)",
    )
    p_complete.add_argument("--output", required=True, help="Output JSON file path")

    args = parser.parse_args()
    client = OmniRouteClient(base_url=args.base_url)

    try:
        if args.command == "status":
            result = client.get_status()
        elif args.command == "start":
            result = client.start_gateway(port=args.port)
        elif args.command == "complete":
            if not args.prompt and not args.prompt_file:
                print("Error: Either --prompt or --prompt-file is required.", file=sys.stderr)
                sys.exit(1)
            result = client.complete(
                prompt=args.prompt,
                prompt_file=args.prompt_file,
                model=args.model,
                system_prompt=args.system_prompt,
                temperature=args.temperature,
                max_tokens=args.max_tokens,
            )
        else:
            print(f"Unknown command: {args.command}", file=sys.stderr)
            sys.exit(1)

        write_output(result, args.output)
    except Exception as e:
        print(f"Command execution error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
