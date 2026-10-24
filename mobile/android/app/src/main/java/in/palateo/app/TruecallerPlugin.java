package in.palateo.app;

import android.content.Intent;
import android.graphics.Color;
import android.util.Base64;
import android.util.Log;

import androidx.appcompat.app.AppCompatActivity;

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

/**
 * Truecaller Mobile Verification Capacitor Plugin for Palateo.
 * Bridges native 1-tap Truecaller OAuth 2.0 PKCE verification to web layer.
 */
@CapacitorPlugin(name = "TruecallerAuth")
public class TruecallerPlugin extends Plugin implements TcOAuthCallback {

    private static final String TAG = "TruecallerAuthPlugin";
    private PluginCall activeCall = null;
    private String activeCodeVerifier = null;
    private boolean isInitialized = false;

    @Override
    public void load() {
        super.load();
        initTruecallerSdk();
    }

    private synchronized void initTruecallerSdk() {
        try {
            AppCompatActivity activity = getActivity();
            if (activity == null) return;
            // The placeholder is not a registered OAuth application.
            if ("palateo_android_client_id".equals(activity.getString(R.string.truecaller_client_id))) return;

            TcSdkOptions tcSdkOptions = new TcSdkOptions.Builder(activity, this)
                    .buttonColor(Color.parseColor("#1a2f33"))
                    .buttonTextColor(Color.parseColor("#ffc64f"))
                    .loginTextPrefix(TcSdkOptions.LOGIN_TEXT_PREFIX_TO_GET_STARTED)
                    .ctaText(TcSdkOptions.CTA_TEXT_CONTINUE)
                    .buttonShapeOptions(TcSdkOptions.BUTTON_SHAPE_ROUNDED)
                    .footerType(TcSdkOptions.FOOTER_TYPE_SKIP)
                    .setEnhancedBottomSheetEnabled(true)
                    .build();

            TcSdk.init(tcSdkOptions);
            isInitialized = true;
            Log.i(TAG, "Truecaller SDK initialized successfully");
        } catch (Throwable t) {
            Log.w(TAG, "Could not initialize Truecaller SDK: " + t.getMessage());
            isInitialized = false;
        }
    }

    @PluginMethod
    public void isUsable(PluginCall call) {
        if (!isInitialized) {
            initTruecallerSdk();
        }

        boolean usable = false;
        try {
            if (isInitialized && TcSdk.getInstance() != null) {
                usable = TcSdk.getInstance().isOAuthFlowUsable();
            }
        } catch (Throwable t) {
            Log.w(TAG, "Error checking isOAuthFlowUsable: " + t.getMessage());
        }

        JSObject res = new JSObject();
        res.put("usable", usable);
        call.resolve(res);
    }

    @PluginMethod
    public void verifyMobile(PluginCall call) {
        if (!isInitialized) {
            initTruecallerSdk();
        }

        try {
            if (!isInitialized || TcSdk.getInstance() == null || !TcSdk.getInstance().isOAuthFlowUsable()) {
                call.reject("Truecaller verification is not available on this device.", "NOT_AVAILABLE");
                return;
            }

            this.activeCall = call;

            // Generate PKCE Code Verifier & Challenge
            String codeVerifier = generateCodeVerifier();
            String codeChallenge = generateCodeChallenge(codeVerifier);
            String state = "palateo_tc_" + System.currentTimeMillis();

            this.activeCodeVerifier = codeVerifier;

            TcSdk.getInstance().setOAuthState(state);
            TcSdk.getInstance().setOAuthScopes(new String[]{"profile", "phone", "openid"});
            TcSdk.getInstance().setCodeChallenge(codeChallenge);

            getActivity().runOnUiThread(() -> {
                try {
                    TcSdk.getInstance().getAuthorizationCode(getActivity());
                } catch (Throwable e) {
                    Log.e(TAG, "Error triggering getAuthorizationCode", e);
                    if (activeCall != null) {
                        activeCall.reject("Failed to open Truecaller prompt: " + e.getMessage());
                        activeCall = null;
                    }
                }
            });
        } catch (Throwable t) {
            Log.e(TAG, "Exception during verifyMobile", t);
            call.reject("Truecaller error: " + t.getMessage());
            this.activeCall = null;
        }
    }

    @Override
    public void onSuccess(TcOAuthData tcOAuthData) {
        Log.i(TAG, "Truecaller verification succeeded");
        if (activeCall == null) return;

        JSObject data = new JSObject();
        data.put("authorizationCode", tcOAuthData.getAuthorizationCode());
        data.put("codeVerifier", activeCodeVerifier != null ? activeCodeVerifier : "");
        data.put("state", tcOAuthData.getState());

        activeCall.resolve(data);
        activeCall = null;
        activeCodeVerifier = null;
    }

    @Override
    public void onFailure(TcOAuthError error) {
        Log.w(TAG, "Truecaller verification failed: [" + error.getErrorCode() + "] " + error.getErrorMessage());
        if (activeCall == null) return;

        activeCall.reject(error.getErrorMessage(), String.valueOf(error.getErrorCode()));
        activeCall = null;
        activeCodeVerifier = null;
    }

    @Override
    public void onVerificationRequired(TcOAuthError error) {
        Log.w(TAG, "Truecaller manual verification required: " + (error != null ? error.getErrorMessage() : ""));
        if (activeCall == null) return;

        activeCall.reject("Truecaller manual verification required.", "VERIFICATION_REQUIRED");
        activeCall = null;
        activeCodeVerifier = null;
    }

    @Override
    protected void handleOnActivityResult(int requestCode, int resultCode, Intent data) {
        super.handleOnActivityResult(requestCode, resultCode, data);
        try {
            if (requestCode == TcSdk.SHARE_PROFILE_REQUEST_CODE && isInitialized && TcSdk.getInstance() != null) {
                TcSdk.getInstance().onActivityResultObtained(getActivity(), requestCode, resultCode, data);
            }
        } catch (Throwable t) {
            Log.w(TAG, "Error handling onActivityResult for Truecaller: " + t.getMessage());
        }
    }

    // Cryptographic PKCE helper methods (RFC 7636)
    private static String generateCodeVerifier() {
        SecureRandom secureRandom = new SecureRandom();
        byte[] code = new byte[32];
        secureRandom.nextBytes(code);
        return Base64.encodeToString(code, Base64.URL_SAFE | Base64.NO_WRAP | Base64.NO_PADDING);
    }

    private static String generateCodeChallenge(String codeVerifier) {
        try {
            byte[] bytes = codeVerifier.getBytes(StandardCharsets.US_ASCII);
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            md.update(bytes, 0, bytes.length);
            byte[] digest = md.digest();
            return Base64.encodeToString(digest, Base64.URL_SAFE | Base64.NO_WRAP | Base64.NO_PADDING);
        } catch (Exception e) {
            return codeVerifier;
        }
    }
}
