package surikov.riffshareii;

import android.annotation.TargetApi;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.support.annotation.*;
import android.support.design.widget.Snackbar;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.View;
import android.webkit.WebResourceRequest;
import android.webkit.WebView;
import android.webkit.WebSettings;
import android.webkit.WebViewClient;
import android.net.Uri;
import android.widget.Toast;

public class WVHTML5 extends AppCompatActivity {

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_wvhtml5);
		WebView webView = (WebView) findViewById(R.id.webview);
		WebSettings webSettings = webView.getSettings();
		webSettings.setJavaScriptEnabled(true);
		webSettings.setDomStorageEnabled(true);
		webView.setWebViewClient(new ExWebViewClient());
		Intent intent = getIntent();
		Uri uri = intent.getData();
		System.out.println("intent data " + uri);
		webView.loadUrl("file:///android_asset/index.html");
	}

	void go(String url) {
		try {
			Uri webpage = Uri.parse(url);
			Intent myIntent = new Intent(Intent.ACTION_VIEW, webpage);
			startActivity(myIntent);
		} catch (Throwable e) {
			Toast.makeText(this, "Ops "+e.getMessage(),  Toast.LENGTH_LONG).show();
			e.printStackTrace();
		}
	}

	private class ExWebViewClient extends WebViewClient {
		boolean exShouldOverrideUrlLoading(String url) {
			String host = Uri.parse(url).getHost();
			System.out.println("shouldOverrideUrlLoading ex '" + host + "'");
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
}

