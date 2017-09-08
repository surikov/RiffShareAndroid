package surikov.riffshareii;

import android.os.Bundle;
import android.support.design.widget.FloatingActionButton;
import android.support.design.widget.Snackbar;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.View;
import android.webkit.WebView;
import android.webkit.WebSettings;
import android.webkit.WebViewClient;
import android.net.Uri;
public class WVHTML5 extends AppCompatActivity {

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_wvhtml5);
		/*Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
		setSupportActionBar(toolbar);

		FloatingActionButton fab = (FloatingActionButton) findViewById(R.id.fab);
		fab.setOnClickListener(new View.OnClickListener() {
			@Override
			public void onClick(View view) {
				Snackbar.make(view, "Replace with your own action", Snackbar.LENGTH_LONG).setAction("Action", null).show();
			}
		});*/
		WebView myWebView = (WebView) findViewById(R.id.webview);
		WebSettings webSettings = myWebView.getSettings();
		webSettings.setJavaScriptEnabled(true);
		myWebView.setWebViewClient(new MyWebViewClient());
		myWebView.loadUrl("file:///android_asset/index.html");
	}
	private class MyWebViewClient extends WebViewClient {
		@Override
		public boolean shouldOverrideUrlLoading(WebView view, String url) {
			System.out.println("shouldOverrideUrlLoading "+url+" - "+Uri.parse(url).getHost());
			//if (Uri.parse(url).getHost().equals("www.example.com")) {
				// This is my web site, so do not override; let my WebView load the page
				//return false;
			//}
			// Otherwise, the link is not for a page on my site, so launch another Activity that handles URLs
			//Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
			//startActivity(intent);
			//return true;
			return false;
		}
	}
}

