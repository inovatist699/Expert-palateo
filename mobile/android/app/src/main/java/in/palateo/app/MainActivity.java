package in.palateo.app;

import android.content.Intent;
import android.os.Bundle;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import com.getcapacitor.BridgeActivity;
import com.truecaller.android.sdk.oAuth.TcSdk;

public class MainActivity extends BridgeActivity {
    final ActivityResultLauncher<Intent> truecallerLauncher = registerForActivityResult(
        new ActivityResultContracts.StartActivityForResult(), result -> {
            try { TcSdk.getInstance().onActivityResultObtained(this, result.getResultCode(), result.getData()); }
            catch (RuntimeException ignored) { }
        });

    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(TruecallerPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
