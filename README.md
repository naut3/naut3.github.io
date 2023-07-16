<script type="text/x-mathjax-config">MathJax.Hub.Config({tex2jax:{inlineMath:[['\$','\$'],['\\(','\\)']],processEscapes:true},CommonHTML: {matchFontHeight:false}});</script>
<script type="text/javascript" async src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-MML-AM_CHTML"></script>

# 作成物置き場

* [実際に表示されるページ](https://naut3.github.io/)
* [githubへのリンク](https://github.com/naut3/naut3.github.io)

## ビジュアライザ

* [グラフの簡易的なビジュアライザ](./visualizer_graph/vis.html)
  * (TODO)根付き木っぽい表示とか、辺の色を変えて最小全域木, 最短経路を強調表示する機能とかを実装したい

* [グリッド状の迷路を探索するビジュアライザ](./visualizer_maze/index.html)
  * wasm を使ってみたかったので、迷路の生成を Rust で書いて JavaScript 側から呼び出せるようにした
  * [ざっくりとした問題設定](./visualizer_maze/problem.md)

## WasmとJavaScriptでのパフォーマンスを比較してみる

* [TSPを2-opt法で解く](./comp_wasm_js/index.html)
  * RustからコンパイルしたWasmと、それを真似て書いたJavaScriptで巡回セールスマン問題を2-opt法で同じ実行時間制限で解いて、解がどのくらい異なるかを見てみる。
  * 都市の数を $N$ として、貪欲解の構成に $O(N^2)$ 必要なので、都市の数は実用的には数千 ~ 1万くらいまでの範囲で動かせる。
