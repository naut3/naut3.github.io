---
title: テストページ
description: MarkdownやLaTeXの挙動を確認するテスト用のページ。
date: 2024-08-04 13:12:32.142 +0000
categories:
    - test
draft: false # 脱稿したら、falseにする
tags:
    - test
math: true # 数式を使わないなら、falseにしたほうがよい。
---

## 見出し2

### 見出し3

#### 見出し4

インライン数式が書ける。 $\displaystyle\sum_{i = 1}^{n} i = \frac{n(n + 1)}{2}$

* 箇条書きのところでも書ける。 $e^{i \pi} + 1 = 0$

ディスプレイ数式モードでも数式を書ける。

$$
f(x) = \frac{1}{\sqrt{2 \pi \sigma^{2}}} \exp{\left( -\frac{(x - \mu)^2}{2 \sigma^2} \right)}
$$

コードブロックもある。インライン表示は右の通り。`println!("Hello World!")`

```rust
let mut a = 5;
let b = 4;
a += 1;
assert_eq!(a + b, 10);
```

[リンク](https://github.com/naut3/naut3.github.io)
