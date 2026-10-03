// Альбомная ориентация + полный экран для Android-проекта.
const fs = require('fs'), path = require('path');
const man = 'android/app/src/main/AndroidManifest.xml';
let m = fs.readFileSync(man, 'utf8');
if (!m.includes('screenOrientation')) m = m.replace('<activity', '<activity android:screenOrientation="sensorLandscape"');
fs.writeFileSync(man, m);
const dir = 'android/app/src/main/java/com/neoncoast/game';
const f = path.join(dir, 'MainActivity.java');
fs.writeFileSync(f, `package com.neoncoast.game;

import android.os.Bundle;
import android.view.View;
import android.view.WindowManager;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
    hideBars();
  }
  @Override
  public void onWindowFocusChanged(boolean hasFocus) {
    super.onWindowFocusChanged(hasFocus);
    if (hasFocus) hideBars();
  }
  private void hideBars() {
    getWindow().getDecorView().setSystemUiVisibility(
      View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY | View.SYSTEM_UI_FLAG_FULLSCREEN |
      View.SYSTEM_UI_FLAG_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_LAYOUT_STABLE |
      View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN);
  }
}
`);
console.log('Android-проект пропатчен');
