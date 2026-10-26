package in.palateo.app;

import android.content.Intent;
import android.util.Base64;
import androidx.activity.result.ActivityResultLauncher;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.truecaller.android.sdk.oAuth.TcOAuthCallback;
import com.truecaller.android.sdk.oAuth.TcOAuthData;
import com.truecaller.android.sdk.oAuth.TcOAuthError;
import com.truecaller.android.sdk.oAuth.TcSdk;
import com.truecaller.android.sdk.oAuth.TcSdkOptions;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;

@CapacitorPlugin(name = "TruecallerAuth")
public class TruecallerPlugin extends Plugin implements TcOAuthCallback {
    private PluginCall activeCall;
    private String activeCodeVerifier;
    private String activeState;
    private volatile boolean initialized;
    private PluginCall prepareCall;

    @PluginMethod
    public void prepare(PluginCall call) {
        if (initialized) { call.resolve(configuration()); return; }
        if (prepareCall != null) { call.reject("Truecaller is starting. Try again.", "BUSY"); return; }
        prepareCall = call;
        getActivity().runOnUiThread(() -> {
            try {
                TcSdk.clear();
                TcSdk.initAsync(new TcSdkOptions.Builder(getActivity(), this)
                        .sdkOptions(TcSdkOptions.OPTION_VERIFY_ONLY_TC_USERS).build());
            } catch (RuntimeException error) { prepareCall = null; call.reject("Truecaller is unavailable.", "NOT_AVAILABLE"); }
        });
        getActivity().getWindow().getDecorView().postDelayed(() -> {
            if (prepareCall == call) { prepareCall = null; call.reject("Truecaller did not start. Use email sign-in.", "NOT_AVAILABLE"); }
        }, 15000);
    }

    @Override
    public void onSdkReady() {
        initialized = true;
        if (prepareCall != null) { prepareCall.resolve(configuration()); prepareCall = null; }
    }

    private JSObject configuration() {
        JSObject result = new JSObject();
        result.put("clientId", getContext().getString(R.string.truecaller_client_id));
        return result;
    }

    @PluginMethod
    public void isUsable(PluginCall call) {
        JSObject result = new JSObject();
        boolean usable = false;
        try { usable = initialized && TcSdk.getInstance().isOAuthFlowUsable(); }
        catch (RuntimeException ignored) { }
        result.put("usable", usable);
        call.resolve(result);
    }

    @PluginMethod
    public void verifyMobile(PluginCall call) {
        if (!initialized) { call.reject("Truecaller verification is unavailable. Use email sign-in.", "NOT_AVAILABLE"); return; }
        if (activeCall != null) { call.reject("Verification is already in progress.", "BUSY"); return; }
        try {
            if (!TcSdk.getInstance().isOAuthFlowUsable()) { call.reject("Truecaller is unavailable.", "NOT_AVAILABLE"); return; }
            activeCall = call;
            getActivity().getWindow().getDecorView().postDelayed(() -> {
                if (activeCall == call) rejectActive("Truecaller verification timed out. Try again or use email sign-in.");
            }, 90000);
            activeCodeVerifier = generateCodeVerifier();
            activeState = generateCodeVerifier();
            TcSdk.getInstance().setOAuthState(activeState);
            TcSdk.getInstance().setOAuthScopes(new String[]{"phone", "openid"});
            TcSdk.getInstance().setCodeChallenge(generateCodeChallenge(activeCodeVerifier));
            getActivity().runOnUiThread(() -> {
                try {
                    ActivityResultLauncher<Intent> launcher = ((MainActivity)getActivity()).truecallerLauncher;
                    TcSdk.getInstance().getAuthorizationCode(getActivity(), launcher);
                } catch (RuntimeException error) { rejectActive("Could not open Truecaller."); }
            });
        } catch (Exception error) { rejectActive("Could not start verification."); }
    }

    @Override
    public void onSuccess(TcOAuthData data) {
        if (activeCall == null) return;
        if (activeState == null || !activeState.equals(data.getState()) || data.getAuthorizationCode() == null) {
            rejectActive("Truecaller response did not match the verification request."); return;
        }
        JSObject result = new JSObject();
        result.put("authorizationCode", data.getAuthorizationCode());
        result.put("codeVerifier", activeCodeVerifier);
        result.put("state", data.getState());
        activeCall.resolve(result);
        clearActive();
    }

    @Override
    public void onFailure(TcOAuthError error) { rejectActive("Truecaller verification failed."); }

    @Override
    public void onVerificationRequired(TcOAuthError error) { rejectActive("Use email sign-in to continue."); }

    private void rejectActive(String message) {
        if (activeCall != null) activeCall.reject(message, "VERIFICATION_FAILED");
        clearActive();
    }

    private void clearActive() { activeCall = null; activeCodeVerifier = null; activeState = null; }

    @Override
    protected void handleOnDestroy() {
        rejectActive("Verification was interrupted. Please try again.");
        if (prepareCall != null) { prepareCall.reject("Verification was interrupted."); prepareCall = null; }
        initialized = false;
    }

    private static String generateCodeVerifier() {
        byte[] bytes = new byte[32];
        new SecureRandom().nextBytes(bytes);
        return Base64.encodeToString(bytes, Base64.URL_SAFE | Base64.NO_WRAP | Base64.NO_PADDING);
    }

    private static String generateCodeChallenge(String verifier) throws Exception {
        byte[] digest = MessageDigest.getInstance("SHA-256").digest(verifier.getBytes(StandardCharsets.US_ASCII));
        return Base64.encodeToString(digest, Base64.URL_SAFE | Base64.NO_WRAP | Base64.NO_PADDING);
    }
}
