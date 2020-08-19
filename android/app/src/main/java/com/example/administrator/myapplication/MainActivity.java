package com.example.administrator.myapplication;

import android.app.ActionBar;
import android.graphics.Bitmap;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
import android.webkit.ConsoleMessage;
import android.webkit.JavascriptInterface;
import android.webkit.JsResult;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.ProgressBar;

public class MainActivity extends AppCompatActivity {
    private WebView webView;
    private ProgressBar progressBar;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        ActionBar actionBar = getActionBar();
        actionBar.hide();
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        progressBar= (ProgressBar)findViewById(R.id.progressbar);//进度条

        webView = (WebView) findViewById(R.id.webview);
        webView.loadUrl("https://buguoheng.com");//加载url

        webView.setWebChromeClient(webChromeClient);
        webView.setWebViewClient(webViewClient);

        WebSettings webSettings=webView.getSettings();
        webSettings.setJavaScriptEnabled(true);//允许使用js
        webView.addJavascriptInterface(this,"android");//添加js监听 这样html就能调用客户端

        /**
         * LOAD_CACHE_ONLY: 不使用网络，只读取本地缓存数据
         * LOAD_DEFAULT: （默认）根据cache-control决定是否从网络上取数据。
         * LOAD_NO_CACHE: 不使用缓存，只从网络获取数据.
         * LOAD_CACHE_ELSE_NETWORK，只要本地有，无论是否过期，或者no-cache，都使用缓存中的数据。
         */
        webSettings.setCacheMode(WebSettings.LOAD_CACHE_ELSE_NETWORK);

        //支持屏幕缩放
        webSettings.setSupportZoom(true);
        webSettings.setBuiltInZoomControls(true);


        //不显示webview缩放按钮
        webSettings.setDisplayZoomControls(false);

        //LocalStroage
        webSettings.setDomStorageEnabled(true);
        webSettings.setAppCacheMaxSize(1024*1024*8);
        String appCachePath = getApplicationContext().getCacheDir().getAbsolutePath();
        webSettings.setAppCachePath(appCachePath);
        webSettings.setAllowFileAccess(true);
        webSettings.setAppCacheEnabled(true);
    }

    //WebViewClient主要帮助WebView处理各种通知、请求事件
    private WebViewClient webViewClient=new WebViewClient(){
        @Override
        public void onPageFinished(WebView view, String url) {//页面加载完成
            progressBar.setVisibility(View.GONE);
        }

        @Override
        public void onPageStarted(WebView view, String url, Bitmap favicon) {//页面开始加载
            progressBar.setVisibility(View.VISIBLE);
        }

        @Override
        public boolean shouldOverrideUrlLoading(WebView view, String url) {
            Log.i("ansen","拦截url:"+url);
            return super.shouldOverrideUrlLoading(view, url);
        }

    };

    //WebChromeClient主要辅助WebView处理Javascript的对话框、网站图标、网站title、加载进度等
    private WebChromeClient webChromeClient=new WebChromeClient(){
        //不支持js的alert弹窗，需要自己监听然后通过dialog弹窗
        @Override
        public boolean onJsAlert(WebView webView, String url, String message, JsResult result) {
            AlertDialog.Builder localBuilder = new AlertDialog.Builder(webView.getContext());
            localBuilder.setMessage(message).setPositiveButton("确定",null);
            localBuilder.setCancelable(false);
            localBuilder.create().show();

            //注意:
            //必须要这一句代码:result.confirm()表示:
            //处理结果为确定状态同时唤醒WebCore线程
            //否则不能继续点击按钮
            result.confirm();
            return true;
        }

        //获取网页标题
        @Override
        public void onReceivedTitle(WebView view, String title) {
            super.onReceivedTitle(view, title);
            Log.i("ansen","网页标题:"+title);
        }

        //加载进度回调
        @Override
        public void onProgressChanged(WebView view, int newProgress) {
            progressBar.setProgress(newProgress);
        }
        public boolean onConsoleMessage(ConsoleMessage cm) {
            Log.d("MyApplication", cm.message() + " -- From line "
                    + cm.lineNumber() + " of "
                    + cm.sourceId() );
            return true;
        }
    };

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        Log.i("ansen","是否有上一个页面:"+webView.canGoBack());
        if (webView.canGoBack() && keyCode == KeyEvent.KEYCODE_BACK){//点击返回按钮的时候判断有没有上一页
            webView.goBack(); // goBack()表示返回webView的上一页面
            return true;
        }
        return super.onKeyDown(keyCode,event);
    }

    /**
     * JS调用android的方法
     * @param str
     * @return
     */
    @JavascriptInterface //仍然必不可少
    public void  getClient(String str){
        Log.i("ansen","html调用客户端:"+str);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();

        //释放资源
        webView.destroy();
        webView=null;
    }
}
