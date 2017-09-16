package surikov.riffshareii;

import android.Manifest;
import android.annotation.*;
import android.content.*;
import android.content.pm.PackageManager;
import android.os.*;
import android.support.v4.app.*;
import android.support.v7.app.*;
import android.webkit.*;
import android.net.*;
import android.widget.*;

import java.io.*;

public class WVHTML5 extends AppCompatActivity {
	WebView webView;
	ValueCallback<Uri[]> chooserCallback;
	int[] data;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_wvhtml5);
		webView = (WebView) findViewById(R.id.webview);
		webView.setWebChromeClient(new WebChromeClient() {
			public boolean onShowFileChooser(android.webkit.WebView webView, ValueCallback<Uri[]> valueCallback, WebChromeClient.FileChooserParams fileChooserParams) {
				System.out.println("onShowFileChooser");
				if (chooserCallback != null) {
					chooserCallback.onReceiveValue(null);
				}
				chooserCallback = valueCallback;
				Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
				intent.setType("audio/midi");
				startActivityForResult(intent, 12321);
				return true;
			}
		});
		webView.addJavascriptInterface(this, "Android5");
		WebSettings webSettings = webView.getSettings();
		webSettings.setJavaScriptEnabled(true);
		webSettings.setDomStorageEnabled(true);
		webView.setWebViewClient(new ExWebViewClient());
		Intent intent = getIntent();
		Uri uri = intent.getData();
		if (uri == null) {
			webView.loadUrl("file:///android_asset/index.html");
		} else {
			String path = uri.toString().replace("https://surikov.github.io/RiffShareAndroid/app/src/main/assets/load.html", "file:///android_asset/load.html");
			webView.loadUrl(path);
		}
	}

	@JavascriptInterface
	public void sendData(int[] data) {
		this.data = data;
		ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE}, 222);
	}

	@Override
	public void onActivityResult(int requestCode, int resultCode, Intent intent) {
		super.onActivityResult(requestCode, resultCode, intent);
		if (resultCode == this.RESULT_OK && requestCode == 12321) {
			if (intent.getDataString() != null) {
				chooserCallback.onReceiveValue(new Uri[]{Uri.parse(intent.getDataString())});
			} else {
				chooserCallback.onReceiveValue(null);
			}
			chooserCallback = null;
		}
	}

	void go(String url) {
		try {
			Uri webpage = Uri.parse(url);
			Intent myIntent = new Intent(Intent.ACTION_VIEW, webpage);
			startActivity(myIntent);
		} catch (Throwable e) {
			e.printStackTrace();
		}
	}

	@Override
	public void onBackPressed() {
		if (webView.canGoBack()) {
			webView.goBack();
		} else {
			super.onBackPressed();
		}
	}

	private class ExWebViewClient extends WebViewClient {
		boolean exShouldOverrideUrlLoading(String url) {
			String host = Uri.parse(url).getHost();
			if (host.trim().length() > 0) {
				go(url);
				return true;
			} else {
				return false;
			}
		}

		@SuppressWarnings("deprecation")
		@Override
		public boolean shouldOverrideUrlLoading(WebView view, String url) {
			return exShouldOverrideUrlLoading(url);
		}

		@TargetApi(Build.VERSION_CODES.N)
		@Override
		public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
			String url = request.getUrl().toString();
			return exShouldOverrideUrlLoading(url);
		}
	}

	@Override
	public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
		super.onRequestPermissionsResult(requestCode, permissions, grantResults);
		switch (requestCode) {
			case 222: {
				if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
					File f = new File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS) + "/riffshareexport.mid");
					System.out.println(f.getAbsolutePath());
					int REQUEST_WRITE_STORAGE = 112;
					ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE}, REQUEST_WRITE_STORAGE);
					try {
						BufferedOutputStream bos = new BufferedOutputStream(new FileOutputStream(f));
						for (int i = 0; i < data.length; i++) {
							bos.write(data[i]);
						}
						bos.flush();
						bos.close();
					} catch (Throwable t) {
						t.printStackTrace();
					}
					Toast.makeText(this, "File saved into /Download/riffshareexport.mid", Toast.LENGTH_LONG).show();
				} else {
					Toast.makeText(this, "The app was not allowed to write to your storage. Hence, it cannot function properly. Please consider granting it this permission", Toast.LENGTH_LONG).show();
				}
			}
		}
	}
}
