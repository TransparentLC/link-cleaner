# link-cleaner

网站链接清洗器。

这个项目受油猴脚本[“Open the F**king URL Right Now”](https://greasyfork.org/zh-CN/scripts/412612)和[“redirect 外链跳转”](https://greasyfork.org/zh-CN/scripts/416338)的启发，作用是对以下类型的超链接进行“净化”处理：

* 阻碍用户直达目标网页的“超不链接”
    * 清洗前：`https://link.zhihu.com/?target=https%3A//example.com`
    * 清洗后：`https://example.com`
* 带有跟踪参数的链接
    * 清洗前：`https://b23.tv/r15682i`（此链接将跳转到 `https://www.bilibili.com/video/BV16u411Z7Pj?p=1&share_medium=android&share_plat=android&share_session_id=439a9ce3-414e-4606-98d6-a0098e305a46&share_source=COPY&share_tag=s_i&timestamp=1652639989&unique_k=r15682i`）
    * 清洗后：`https://www.bilibili.com/video/av506045471`
* 隐藏推广、返利参数的链接
    * 清洗前：`https://www.vultr.com/?ref=114514`
    * 清洗后：`https://www.vultr.com/`

## 使用方式

提供油猴脚本和 Cloudflare Workers 两种使用方式。

### 油猴脚本

https://i.akarin.dev/link-cleaner.user.js

脚本会对网页上所有 `<a>` 标签指向的链接进行清洗。如果你当前打开的页面的 URL 本身可以被清洗，则脚本也会自动跳转到清洗过的 URL。

也可以在菜单中选择手动清洗网页上的所有链接（用于动态添加 `<a>` 标签的情况）。此外，还附带了复制当前页面的标题和网址的功能。

### Cloudflare Workers

https://i.akarin.dev/link-cleaner/?url=https://example.com

https://i.akarin.dev/link-cleaner/?title&url=https://example.com

使用 `url` 参数输入链接，将返回清洗后的结果。

如果需要获取这个链接对应的网页的标题（`<title>`），可以在请求时添加 `title` 参数。

## 自行修改

### 编译

`src/entry-userscript.js` 和 `src/entry-cfworker.js` 分别是适用于油猴脚本和 Cloudflare Workers 的相关代码。如果需要将清洗功能用于其它用途，也可以直接导入 `src/link-cleaner.js` 中的函数。

运行 `npm run build` 就可以在 `dist` 目录找到 `link-cleaner.user.js` 和 `link-cleaner.cfworker.js` 两个编译出的文件了。

### 编辑清洗规则

所有的清洗规则定义在 `src/clean-rules.js` 这个文件中。一条规则由 `name`、`match`、`clean` 三个参数组成，分别表示规则的名称、检查链接是否匹配规则的函数和清洗链接的函数。

例如，对于以下的规则：

```js
{
    name: 'Zhihu/Juejin link',
    match: matchFactory.hostpath(new Set(['link.zhihu.com', 'link.juejin.cn']), '/'),
    clean: cleanFactory.urlDecodeSearchParam('target'),
}
```

这条规则的作用是，对于形如 `https://link.zhihu.com/?target=...` 或 `https://link.juejin.cn/?target=...` 的链接，获取链接中 URL 参数 `target` 的值，作为清洗的结果。

一个链接在清洗过程中可能会匹配不止一条规则，清洗将一直进行到没有匹配的规则，或清洗后的链接相比清洗前没有变化为止。

为了方便编写匹配规则和清洗过程，`src/match-factory.js` 和 `src/clean-factory.js` 中预定义了一些匹配和清洗规则的工厂函数（具体的参数定义可以参见这两个文件的注释），可以直接拿来使用：

* `matchFactory.chain(fn0, fn1, fn2, ...)` 依次使用 `fn0`、`fn1`、`fn2` 等函数检查匹配，只有全部匹配才会返回 `true`
* `matchFactory.hostpath(hostname, pathname)` 匹配指定的域名和路径
* `matchFactory.hostpathRegex(hostname, pathnameRegex)` 匹配指定的域名和路径，路径需要匹配给定的正则表达式
* `matchFactory.hasSearchParam(p)` 带有指定的 URL 参数
* `cleanFactory.chain(fn0, fn1, fn2, ...)` 依次使用 `fn0`、`fn1`、`fn2` 等函数进行清洗
* `cleanFactory.urlDecodeSearchParam(p)` 将指定 URL 参数的值作为清洗结果
* `cleanFactory.base64DecodeSearchParam(p)` 将指定 URL 参数的值进行 Base64 解码后作为清洗结果
* `cleanFactory.blacklist(p)` 去除指定的 URL 参数
* `cleanFactory.whitelist(p)` 去除指定的 URL 参数以外的其它所有 URL 参数
* `cleanFactory.getSearch` 将 URL 的整个 Query String 作为清洗结果
* `cleanFactory.getRedirect` 使用 `fetch` 向待清洗的 URL 发出请求，以重定向的 URL（`Location` 响应头）作为清洗结果
* `cleanFactory.getRedirectFromBody(fn)` 使用 `fetch` 向待清洗的 URL 发出请求，对响应内容使用指定函数获取清洗结果
* `cleanFactory.bv2av` 将 URL 中的 Bilibili 的 BV 号替换为 AV 号
* `cleanFactory.useHttps` 将 URL 使用的协议修改为 `https`
