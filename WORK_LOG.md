# 2022/01/16

- やること
    - CSS の基本的な仕様をカバーする文字列の扱いを勉強する
        - height, width, border-radius, padding, margin
        - 出力はFlutter でもいい
- 今度やりたいこと
    - parse error 処理周りのドキュメントを読む
        - https://www.w3.org/TR/CSS2/syndata.html#parsing-errors
        - https://limpet.net/mbrubeck/2014/08/13/toy-layout-engine-3-css.html
        - https://www.w3.org/TR/CSS2/syndata.html#parsing-errors

# 2022/01/15

- やること
    - Style Tree を作ります
        - https://limpet.net/mbrubeck/2014/08/23/toy-layout-engine-4-style.html
- やったこと
    - Style Tree を生成するコード作った
        - https://limpet.net/mbrubeck/2014/08/23/toy-layout-engine-4-style.html
    - RGB をパースするコードをバグ修正した
        - Number.parseInt の第二引数を誤って設定していた。正しくは Length

# 2022/01/15

- 目指すこと
    - TypeScript で動くものを作る
- やったこと
    - サンプルの html, css ファイルを用意して読み込めるようにした
    - Selector の parse を実装した
        - parseSimpleSelector
    - CSS の Parser 書けた💡
- 今度やりたいこと
    - parse error どうやるの?
        - https://www.w3.org/TR/CSS2/syndata.html#parsing-errors
        - https://limpet.net/mbrubeck/2014/08/13/toy-layout-engine-3-css.html
        - https://www.w3.org/TR/CSS2/syndata.html#parsing-errors

# 2022/01/08

- 方針変更します
    - Part: 5 からは読んで理解するだけにする。
        - https://limpet.net/mbrubeck/2014/09/08/toy-layout-engine-5-boxes.html
    - 理由
        - 飽きてる & 他にやりたいことがある & 今勉強するのがベスト
        - 今、ささっと終わらせるのがベスト
- やること
    - Part: 5 を読む
    - Part: 6 を読む
    - Part: 7 を読む

# 2022/01/07

- やったこと
    - css.ts の実装
        - https://limpet.net/mbrubeck/2014/08/13/toy-layout-engine-3-css.html
    - Part 4: Style を全部読んだ
        - https://limpet.net/mbrubeck/2014/08/23/toy-layout-engine-4-style.html
- 次やること
    - Part 4: Style を読みながらコードを書く
        - https://limpet.net/mbrubeck/2014/08/23/toy-layout-engine-4-style.html

# 2022/01/06

### やったこと

- Part1 読んで Dom の型を書いた
    - https://limpet.net/mbrubeck/2014/08/08/toy-layout-engine-1.html
- Part2 読んで Parser を書いた
    - https://limpet.net/mbrubeck/2014/08/11/toy-layout-engine-2.html
- Part3 をちょろっと読んで終わり
    - https://limpet.net/mbrubeck/2014/08/13/toy-layout-engine-3-css.html
- 環境構築

# 2022/01/04

- やったこと
    - [📚ブラウザの仕組みを学ぶ](https://zenn.dev/silverbirder/articles/e10295948e17ca) を読む
- 次やること
    - []https://limpet.net/mbrubeck/2014/08/08/toy-layout-engine-1.html
