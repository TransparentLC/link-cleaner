import matchFactory from './match-factory.js';
import cleanFactory from './clean-factory.js';

/**
 * @typedef {import('./match-factory.js').matchFunction} matchFunction
 * @typedef {import('./clean-factory.js').cleanFunction} cleanFunction
 * @typedef {{
 *  name: String,
 *  match: matchFunction,
 *  clean: cleanFunction,
 * }} cleanRule
 */

/** @type {cleanRule[]} */
export default [
    {
        name: 'Remove utm',
        match: matchFactory.hasSearchParam(new Set([
            'bbid',
            'mkt_tok',
            'plat_id',
            'spm',
            'spm_id_from',
            'from_spmid',
            'spmid',
            'share_from',
            'share_id',
            'share_medium',
            'share_plat',
            'share_session_id',
            'share_source',
            'share_tag',
            'track_id',
            'unique_k',
            'um_tc',
            'utm_source',
            'utm_medium',
            'utm_campaign',
            'utm_content',
            'utm_id',
            'utm_term',
            'utm_member',
            'utm_name',
            'utm_oi',
            'utm_psn',
            'vd_source',
        ])),
        clean: cleanFactory.blacklist(new Set([
            'bbid',
            'mkt_tok',
            'plat_id',
            'spm',
            'spm_id_from',
            'from_spmid',
            'spmid',
            'share_from',
            'share_id',
            'share_medium',
            'share_plat',
            'share_session_id',
            'share_source',
            'share_tag',
            'track_id',
            'unique_k',
            'um_tc',
            'utm_source',
            'utm_medium',
            'utm_campaign',
            'utm_content',
            'utm_id',
            'utm_term',
            'utm_member',
            'utm_name',
            'utm_oi',
            'utm_psn',
            'vd_source',
        ])),
    },
    {
        name: 'Zhihu/Juejin/CSDN link',
        match: matchFactory.hostpath(new Set(['link.zhihu.com', 'link.juejin.cn', 'link.csdn.net']), '/'),
        clean: cleanFactory.urlDecodeSearchParam('target'),
    },
    {
        name: 'sspai/gcores/Afdian/Gitee link',
        match: matchFactory.hostpath(new Set(['sspai.com', 'www.gcores.com', 'afdian.net', 'gitee.com']), '/link'),
        clean: cleanFactory.urlDecodeSearchParam('target'),
    },
    {
        name: 'Leetcode link',
        match: matchFactory.hostpath('leetcode.cn', '/link/'),
        clean: cleanFactory.urlDecodeSearchParam('target'),
    },
    {
        name: 'Nowcoder link',
        match: matchFactory.hostpath('hd.nowcoder.com', '/link.html'),
        clean: cleanFactory.urlDecodeSearchParam('target'),
    },
    {
        name: 'Tencent cloud link',
        match: matchFactory.hostpath('cloud.tencent.com', '/developer/tools/blog-entry'),
        clean: cleanFactory.urlDecodeSearchParam('target'),
    },
    {
        name: 'Aliyun developer',
        match: matchFactory.hostpath('developer.aliyun.com', '/redirect'),
        clean: cleanFactory.urlDecodeSearchParam('target'),
    },
    {
        name: 'Kook/Kaihela link',
        match: matchFactory.hostpath(new Set(['www.kookapp.cn', 'www.kaiheila.cn']), '/go-wild.html'),
        clean: cleanFactory.urlDecodeSearchParam('url'),
    },
    {
        name: 'Curseforge link',
        match: matchFactory.hostpath('www.curseforge.com', '/linkout'),
        clean: url => url.searchParams.has('remoteUrl') ? new URL(decodeURIComponent(decodeURIComponent(url.searchParams.get('remoteUrl')))) : url,
    },
    {
        name: 'Zaker link',
        match: matchFactory.hostpath('iphone.myzaker.com', '/zaker/link.php'),
        clean: cleanFactory.base64DecodeSearchParam('b'),
    },
    {
        name: 'Logonews link',
        match: matchFactory.hostpath('link.logonews.cn', '/'),
        clean: cleanFactory.urlDecodeSearchParam('url'),
    },
    {
        name: 'Pixiv link',
        match: matchFactory.hostpath('www.pixiv.net', '/jump.php'),
        clean: cleanFactory.getSearch,
    },
    {
        name: '5ch link',
        match: matchFactory.hostpath('jump.5ch.net', '/'),
        clean: cleanFactory.getSearch,
    },
    {
        name: 'KDocs link',
        match: matchFactory.hostpath('www.kdocs.cn', '/office/link'),
        clean: cleanFactory.urlDecodeSearchParam('target'),
    },
    {
        name: 'Shimo link (black)',
        match: matchFactory.hostpath('shimo.im', '/outlink/black'),
        clean: cleanFactory.urlDecodeSearchParam('url'),
    },
    {
        name: 'Shimo link (gray)',
        match: matchFactory.hostpath('shimo.im', '/outlink/gray'),
        clean: cleanFactory.urlDecodeSearchParam('url'),
    },
    {
        name: 'TianYanCha link',
        match: matchFactory.hostpath('www.tianyancha.com', '/security'),
        clean: cleanFactory.urlDecodeSearchParam('target'),
    },
    {
        name: 'AiQiCha link',
        match: matchFactory.hostpath('aiqicha.baidu.com', '/safetip'),
        clean: cleanFactory.urlDecodeSearchParam('target'),
    },
    {
        name: 'QiChaCha link',
        match: matchFactory.hostpath('www.qcc.com', '/web/transfer-link'),
        clean: cleanFactory.urlDecodeSearchParam('link'),
    },
    {
        name: 'Uisdc link',
        match: matchFactory.hostpath('link.uisdc.com', '/'),
        clean: cleanFactory.urlDecodeSearchParam('redirect'),
    },
    {
        name: '51cto link',
        match: matchFactory.hostpath('blog.51cto.com', '/transfer'),
        clean: cleanFactory.getSearch,
    },
    {
        name: 'Feishu link',
        match: matchFactory.hostpath('security.feishu.cn', '/link/safety'),
        clean: cleanFactory.urlDecodeSearchParam('target'),
    },
    {
        name: 'Instagram link',
        match: matchFactory.hostpath('www.instagram.com', '/linkshim/'),
        clean: cleanFactory.urlDecodeSearchParam('u'),
    },
    {
        name: 'Jianshu link (link.jianshu.com)',
        match: matchFactory.hostpath('link.jianshu.com', '/'),
        clean: cleanFactory.urlDecodeSearchParam('t'),
    },
    {
        name: 'Jianshu link (links.jianshu.com)',
        match: matchFactory.hostpath('links.jianshu.com', '/go'),
        clean: cleanFactory.urlDecodeSearchParam('to'),
    },
    {
        name: 'Jianshu link (go-wild)',
        match: matchFactory.hostpath('www.jianshu.com', '/go-wild'),
        clean: cleanFactory.urlDecodeSearchParam('url'),
    },
    {
        name: 'SegmentFault link',
        match: matchFactory.hostpath('link.segmentfault.com', '/'),
        clean: cleanFactory.getRedirectFromBody(s => s.match(/<body data-url="(.+?)">/)[1]),
    },
    {
        name: 'OSChina link',
        match: matchFactory.hostpath('www.oschina.net', '/action/GoToLink'),
        clean: cleanFactory.urlDecodeSearchParam('url'),
    },
    {
        name: 'LD246 link',
        match: matchFactory.hostpath('ld246.com', '/forward'),
        clean: cleanFactory.urlDecodeSearchParam('goto'),
    },
    {
        name: '360doc link',
        match: matchFactory.hostpath('www.360doc.cn', '/outlink.html'),
        clean: cleanFactory.urlDecodeSearchParam('url'),
    },
    {
        name: 'Tieba link',
        match: matchFactory.hostpath('jump2.bdimg.com', '/safecheck/index'),
        clean: cleanFactory.getRedirectFromBody(s => s.match(/<p class="link">(.+?)<\/p>/)[1]),
    },
    {
        name: 'QQ mail link',
        match: matchFactory.chain(
            matchFactory.hostpath(new Set(['mail.qq.com', 'exmail.qq.com']), '/cgi-bin/readtemplate'),
            url => url.searchParams.get('t') === 'safety',
        ),
        clean: cleanFactory.urlDecodeSearchParam('gourl'),
    },
    {
        name: 'QQ mail link',
        match: matchFactory.hostpath('wx.mail.qq.com', '/xmspamcheck/xmsafejump'),
        clean: cleanFactory.urlDecodeSearchParam('url'),
    },
    {
        name: 'QQ docs link',
        match: matchFactory.hostpath('docs.qq.com', '/scenario/link.html'),
        clean: cleanFactory.urlDecodeSearchParam('url'),
    },
    {
        name: 'Tencent TXC link',
        match: matchFactory.hostpathRegex('txc.qq.com', /^\/products\/\d+\/link-jump$/),
        clean: cleanFactory.urlDecodeSearchParam('jump'),
    },
    {
        name: 'Youtube link',
        match: matchFactory.hostpath('www.youtube.com', '/redirect'),
        clean: cleanFactory.urlDecodeSearchParam('q'),
    },
    {
        name: 'Steam community/Bilibili wiki link',
        match: matchFactory.hostpath(new Set(['steamcommunity.com', 'game.bilibili.com']), '/linkfilter/'),
        clean: cleanFactory.urlDecodeSearchParam('url'),
    },
    {
        name: 'GamerTW link',
        match: matchFactory.hostpath('ref.gamer.com.tw', '/redir.php'),
        clean: cleanFactory.urlDecodeSearchParam('url'),
    },
    {
        name: 'Hellogithub link',
        match: matchFactory.hostpath('hellogithub.com', '/periodical/statistics/click'),
        clean: cleanFactory.urlDecodeSearchParam('target'),
    },
    {
        name: 'Yuque link',
        match: matchFactory.hostpath('www.yuque.com', '/r/goto'),
        clean: cleanFactory.urlDecodeSearchParam('url'),
    },
    {
        name: 'MCBBS link',
        match: matchFactory.chain(
            matchFactory.hostpath('www.mcbbs.net', '/plugin.php'),
            url => url.searchParams.get('id') === 'link_redirect',
            matchFactory.hasSearchParam('target'),
        ),
        clean: cleanFactory.urlDecodeSearchParam('target'),
    },
    {
        name: 'Zhihu search link',
        match: matchFactory.hostpath('www.zhihu.com', '/search'),
        clean: cleanFactory.whitelist(new Set(['q', 'type', 'correction'])),
    },
    {
        name: 'Baidu search link',
        match: matchFactory.hostpath('www.baidu.com', '/s'),
        clean: cleanFactory.whitelist(new Set(['wd', 'pn', 'nojc', 'gpc', 'si'])),
    },
    {
        name: 'Baidu search result link',
        match: matchFactory.chain(
            matchFactory.hostpath('www.baidu.com', '/link'),
            matchFactory.hasSearchParam('url'),
        ),
        clean: cleanFactory.chain(
            url => {
                url.searchParams.set('wd', '');
                url.searchParams.set('eqid', '');
            },
            cleanFactory.getRedirectFromBody(s => s.match(/URL='(.+?)'/)[1]),
        ),
    },
    {
        name: 'Weibo link',
        match: matchFactory.hostpath('weibo.cn', '/sinaurl'),
        clean: url => cleanFactory.urlDecodeSearchParam(url.searchParams.has('u') ? 'u' : 'toasturl')(url),
    },
    {
        name: 'Weibo link',
        match: matchFactory.hostpathRegex('weibo.com', /^\/\d+\/\d+$/),
        clean: cleanFactory.whitelist(new Set),
    },
    {
        name: 't.cn short link',
        match: matchFactory.hostpath('t.cn', null),
        clean: cleanFactory.getRedirect,
    },
    {
        name: 'Zhihu short link',
        match: matchFactory.hostpath('s.zhihu.com', null),
        clean: cleanFactory.chain(
            cleanFactory.useHttps,
            cleanFactory.getRedirect,
            cleanFactory.whitelist(new Set),
        ),
    },
    {
        name: 'Zhihu short link alt',
        match: matchFactory.hostpath('zhi.hu', null),
        clean: url => {
            url.host = 's.zhihu.com';
            return url;
        },
    },
    {
        name: 'Taobao short link',
        match: matchFactory.hostpathRegex('e.tb.cn', /^\/h\.[\dA-Za-z]+$/),
        clean: cleanFactory.chain(
            cleanFactory.getRedirectFromBody(s => s.match(/var url = '(.+?)'/)[1]),
            url => {
                if (url.hostname.match(/^[\dA-Za-z]+\.(?:m\.)?taobao\.com$/) && url.pathname === '/') {
                    url = cleanFactory.whitelist(new Set)(url);
                }
                return url;
            },
        ),
    },
    {
        name: 'Taobao afford link',
        match: matchFactory.hostpath('s.click.taobao.com', '/t'),
        clean: cleanFactory.chain(
            async url => {
                const resp1 = await fetch(url, {
                    redirect: 'manual',
                    credentials: globalThis.ENV === 'cfworker' ? undefined : 'omit',
                });
                url = new URL((await resp1.text()).match(/var real_jump_address = '(.+?)'/)[1].replaceAll('&amp;', '&'));
                const resp2 = await fetch(url, {
                    redirect: 'manual',
                    credentials: globalThis.ENV === 'cfworker' ? undefined : 'omit',
                    headers: {
                        Referer: 'https://s.click.taobao.com/',
                    },
                });
                return globalThis.ENV === 'userscript' ? new URL(resp2.url) : (resp2.headers.has('location') ? new URL(resp2.headers.get('location')) : url);
            },
            cleanFactory.urlDecodeSearchParam('tar'),
        ),
    },
    {
        name: 'Taobao item link (a.m.taobao.com)',
        match: matchFactory.hostpathRegex('a.m.taobao.com', /^\/i\d+\.htm$/),
        clean: url => {
            const id = url.pathname.toString().match(/^\/i(\d+)\.htm$/)[1];
            url = new URL('https://item.taobao.com/item.htm');
            url.searchParams.set('id', id);
            return url;
        },
    },
    {
        name: 'Taobao item link (uland.taobao.com)',
        match: matchFactory.chain(
            matchFactory.hostpath('uland.taobao.com', '/coupon/edetail'),
            matchFactory.hasSearchParam('e'),
        ),
        clean: cleanFactory.whitelist(new Set(['e'])),
    },
    {
        name: 'Taobao item link',
        match: matchFactory.chain(
            url => (
                matchFactory.hostpath('item.taobao.com', '/item.htm')(url) ||
                matchFactory.hostpath('h5.m.taobao.com', '/awp/core/detail.htm')(url)
            ),
            matchFactory.hasSearchParam('id'),
        ),
        clean: url => {
            const u = new URL('https://item.taobao.com/item.htm');
            u.searchParams.set('id', url.searchParams.get('id'));
            return u;
        },
    },
    {
        name: 'Tmall item link',
        match: matchFactory.chain(
            matchFactory.hostpath(new Set(['detail.tmall.com', 'detail.m.tmall.com']), '/item.htm'),
            matchFactory.hasSearchParam('id'),
        ),
        clean: url => {
            const u = new URL('https://detail.tmall.com/item.htm');
            u.searchParams.set('id', url.searchParams.get('id'));
            return u;
        },
    },
    {
        name: 'Bilibili short link',
        match: matchFactory.hostpath(new Set(['b23.tv', 'bili2233.cn', 'bili22.cn', 'bili33.cn', 'bili23.cn',]), null),
        clean: cleanFactory.chain(
            cleanFactory.getRedirect,
            cleanFactory.blacklist(new Set(['timestamp'])),
        ),
    },
    {
        name: 'Bilibili video',
        match: url => (url.hostname === 'www.bilibili.com' || url.hostname === 'm.bilibili.com') && /^\/video\/[Bb][Vv][A-HJ-NP-Za-km-z1-9]{10}\/?$/.test(url.pathname),
        clean: cleanFactory.chain(
            cleanFactory.whitelist(new Set),
            cleanFactory.bv2av,
        ),
    },
    {
        name: 'Douyin short link',
        match: matchFactory.hostpathRegex('v.douyin.com', /^\/[\dA-Za-z]+\/?$/),
        clean: cleanFactory.chain(
            cleanFactory.getRedirect,
            url => {
                let m ;
                if (m = url.pathname.match(/^\/share\/video\/(\d+)\/?$/)) {
                    return new URL(`https://www.douyin.com/video/${m[1]}`);
                }
                if (m = url.pathname.match(/^\/share\/user\/([\dA-Za-z-]+)\/?$/)) {
                    return new URL(`https://www.douyin.com/user/${m[1]}`);
                }
                return url;
            }
        )
    },
    {
        name: 'Douyin link',
        match: matchFactory.hostpath('www.douyin.com', null),
        clean: cleanFactory.blacklist(new Set([
            'enter_from',
            'enter_method',
            'extra_params',
            'modeFrom',
            'previous_page',
            'secUid',
            'source',
        ])),
    },
    {
        name: 'Douban link',
        match: matchFactory.hostpath('www.douban.com', '/link2/'),
        clean: cleanFactory.urlDecodeSearchParam('url'),
    },
    {
        name: 'Mafengwo link',
        match: matchFactory.hostpath('m.mafengwo.cn', '/nb/link/jumper'),
        clean: cleanFactory.urlDecodeSearchParam('url'),
    },
    {
        name: 'Sogou link',
        match: matchFactory.hostpath('m.sogou.com', '/web/tc'),
        clean: cleanFactory.urlDecodeSearchParam('url'),
    },
    {
        name: 'Chinaz link',
        match: matchFactory.hostpath('www.chinaz.com', '/go.shtml'),
        clean: cleanFactory.urlDecodeSearchParam('url'),
    },
    {
        name: 'PC6 link',
        match: matchFactory.hostpath('www.pc6.com', '/goread.html'),
        clean: cleanFactory.urlDecodeSearchParam('gourl'),
    },
    {
        name: 'Yinxiang link',
        match: matchFactory.hostpath('app.yinxiang.com', '/OutboundRedirect.action'),
        clean: cleanFactory.urlDecodeSearchParam('dest'),
    },
    {
        name: 'AMap link',
        match: matchFactory.hostpathRegex('surl.amap.com', /^\/[\da-zA-Z]+?$/),
        clean: cleanFactory.chain(
            cleanFactory.getRedirect,
            cleanFactory.whitelist(new Set(['p'])),
        ),
    },
    {
        name: 'QQ middlem',
        match: matchFactory.hostpath('c.pc.qq.com', new Set(['/middlem.html', '/middleb.html', '/index.html'])),
        clean: cleanFactory.urlDecodeSearchParam('pfurl'),
    },
    {
        name: 'QQ middlem',
        match: matchFactory.hostpath('c.pc.qq.com', new Set(['/pc.html', '/ios.html'])),
        clean: cleanFactory.urlDecodeSearchParam('url'),
    },
    {
        name: 'Qzone link (urlshare)',
        match: matchFactory.hostpath('www.urlshare.cn', '/umirror_url_check'),
        clean: cleanFactory.urlDecodeSearchParam('url'),
    },
    {
        name: 'weixin110',
        match: matchFactory.hostpath('weixin110.qq.com', '/cgi-bin/mmspamsupport-bin/newredirectconfirmcgi'),
        clean: cleanFactory.getRedirectFromBody(s => s.match(/"url":"(.+?)","btns"/)[1].replace(/&#x([a-f\d]+);/gi, (_, m) => String.fromCharCode(parseInt(m, 16)))),
    },
    {
        name: 'Weixin article',
        match: matchFactory.hostpath('mp.weixin.qq.com', '/s'),
        clean: cleanFactory.whitelist(new Set(['__biz', 'mid', 'idx', 'sn', 'tempkey', 'poc_token'])),
    },
    {
        name: 'Weixin developers link',
        match: matchFactory.hostpath('developers.weixin.qq.com', '/community/middlepage/href'),
        clean: cleanFactory.urlDecodeSearchParam('href'),
    },
    {
        name: 'ITHome link',
        match: matchFactory.hostpath('img.ithome.com', '/app/redirect/index.html'),
        clean: cleanFactory.urlDecodeSearchParam('url'),
    },
    {
        name: 'LaTeX studio',
        match: matchFactory.hostpath('ask.latexstudio.net', '/go/index'),
        clean: cleanFactory.urlDecodeSearchParam('url'),
    },
    {
        name: 'SMZDM afford',
        match: matchFactory.hostpathRegex('go.smzdm.com', /^\/[\da-f]{16}\/.+?$/),
        clean: cleanFactory.chain(
            cleanFactory.getRedirectFromBody(s => {
                const match = s.match(/^\s*eval\(function\(p,a,c,k,e,[dr]\){.+?}\('(.*)',\d+,\d+,'(.*)'\.split\('\|'\),0,{}\)\)\s*$/m);
                const dict = Object.fromEntries(match[2].split('|').map((e, i) => {
                    let c = '';
                    while (i) {
                        const m = i % 62;
                        c = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'[m] + c;
                        i = (i - m) / 62;
                    }
                    return [c || '0', e];
                }));
                return match[1].replaceAll('\\', '').replace(/\b\w+\b/g, m => dict[m] || m).match(/smzdmhref='(.*?)'/)[1];
            }),
            cleanFactory.urlDecodeSearchParam('to'),
        ),
    },
    {
        name: 'JD afford',
        match: matchFactory.hostpathRegex('u.jd.com', /^\/[\dA-Za-z]{7}$/),
        clean: cleanFactory.chain(
            cleanFactory.getRedirectFromBody(s => s.match(/var hrl='(.+?)'/)[1]),
            cleanFactory.blacklist(new Set(['refer', 'a', 'd', 'e'])),
            cleanFactory.getRedirect,
            cleanFactory.blacklist(new Set(['cu'])),
        ),
    },
    {
        name: 'Aliyun afford',
        match: matchFactory.chain(
            matchFactory.hostpath('www.aliyun.com', '/daily-act/ecs/activity_selection'),
            matchFactory.hasSearchParam('userCode'),
        ),
        clean: () => new URL('https://www.aliyun.com/daily-act/ecs/activity_selection'),
    },
    {
        name: 'Qcloud afford',
        match: matchFactory.chain(
            matchFactory.hostpath('cloud.tencent.com', '/act/cps/redirect'),
            matchFactory.hasSearchParam(new Set(['redirect', 'cps_key'])),
        ),
        clean: () => new URL('https://cloud.tencent.com/act'),
    },
    {
        name: 'Qcloud afford short',
        match: matchFactory.hostpath('curl.qcloud.com'),
        clean: () => new URL('https://cloud.tencent.com/act/pro/voucherslist'),
    },
    {
        name: 'Vultr afford',
        match: matchFactory.chain(
            matchFactory.hostpath('www.vultr.com', '/'),
            matchFactory.hasSearchParam('ref'),
        ),
        clean: () => new URL('https://www.vultr.com/'),
    },
    {
        name: 'Linode afford',
        match: matchFactory.chain(
            matchFactory.hostpath('www.linode.com', '/'),
            matchFactory.hasSearchParam('r'),
        ),
        clean: () => new URL('https://www.linode.com/'),
    },
    {
        name: 'GigsGigsCloud afford',
        match: matchFactory.chain(
            matchFactory.hostpath('clientarea.gigsgigscloud.com'),
            matchFactory.hasSearchParam('affid'),
        ),
        clean: cleanFactory.blacklist(new Set(['affid'])),
    },
    {
        name: 'BandwagonHOST/HostDare afford',
        match: matchFactory.chain(
            matchFactory.hostpath(new Set([
                'bandwagonhost.com',
                'bwh1.net',
                'bwh8.net',
                'bwh81.net',
                'bwh88.net',
                'bwh89.net',
                'manage.hostdare.com',
            ]), '/aff.php'),
            matchFactory.hasSearchParam('aff'),
        ),
        clean: url => {
            if (url.searchParams.has('pid')) {
                url.pathname = 'cart.php';
                const pid = url.searchParams.get('pid');
                Array.from(url.searchParams.keys()).forEach(e => url.searchParams.delete(e));
                url.searchParams.set('a', 'add');
                url.searchParams.set('pid', pid);
            } else {
                url.pathname = '/';
                Array.from(url.searchParams.keys()).forEach(e => url.searchParams.delete(e));
            }
        },
    },
    {
        name: 'DigitalOcean afford',
        match: matchFactory.chain(
            matchFactory.hostpath('www.digitalocean.com', '/'),
            matchFactory.hasSearchParam('refcode'),
        ),
        clean: () => new URL('https://www.digitalocean.com/'),
    },
    {
        name: 'DigitalOcean afford short',
        match: matchFactory.hostpathRegex('m.do.co', /^\/c\/[\da-f]{12}$/),
        clean: () => new URL('https://www.digitalocean.com/'),
    },
    {
        name: 'Qinlili redirect',
        match: matchFactory.hostpath('qinlili.bid', '/redirect.html'),
        clean: cleanFactory.urlDecodeSearchParam('target'),
    },
    {
        name: 'Outgoing mozaws',
        match: matchFactory.hostpathRegex('outgoing.prod.mozaws.net', /^\/v1\/[\da-f]{64}\//),
        clean: url => new URL(decodeURIComponent(url.pathname.toString().match(/^\/v1\/[\da-f]{64}\/(.+)$/)[1])),
    },
    {
        name: 'WordPress link (Simple URLs)',
        match: url => /^\/go\/[\da-zA-Z\-]+\/?$/.test(url.pathname) && !/^\/go\/aHR0c(?:HM6|Dov)/.test(url.pathname) && !/(?:www\.)?v2ex\.com/.test(url.hostname),
        clean: cleanFactory.getRedirect,
    },
    {
        name: 'WordPress link (go/go.php url/base64)',
        match: url => url.pathname === '/go/' || url.pathname === '/go.php',
        clean: url => {
            try {
                return cleanFactory.base64DecodeSearchParam('url')(url);
            } catch {
                return cleanFactory.urlDecodeSearchParam('url')(url);
            }
        },
    },
    {
        name: 'WordPress link (go/goto base64)',
        match: url => /^\/(?:index\.php\/)?go(?:to)?\/(aHR0c(?:HM6|Dov)[\da-zA-Z\-_]+=*)$/.test(url.pathname),
        clean: url => new URL(atob(url.pathname.match(/^\/(?:index\.php\/)?go(?:to)?\/(aHR0c(?:HM6|Dov)[\da-zA-Z\-_]+=*)$/)[1].replace(/-/g, '+').replace(/_/g, '/'))),
    },
    {
        name: 'WordPress link (cp-link-open base64)',
        match: matchFactory.hostpath(null, '/wp-content/plugins/cp-link-open/link.php'),
        clean: cleanFactory.base64DecodeSearchParam('a'),
    },
    {
        name: 'WordPress link (golink base64)',
        match: matchFactory.chain(
            matchFactory.hostpath(null, '/'),
            matchFactory.hasSearchParam('golink'),
        ),
        clean: url => new URL(atob(url.searchParams.get('golink'))),
    },
    {
        name: 'Xiuno link (gowild.htm)',
        match: matchFactory.chain(
            matchFactory.hostpath(null, '/gowild.htm'),
            matchFactory.hasSearchParam('url'),
        ),
        clean: url => new URL(url.searchParams.get('url').replace(/_([a-f\d]{2})/gi, (_, m) => String.fromCharCode(parseInt(m, 16)))),
    },
    {
        name: 'Tieba post',
        match: matchFactory.hostpathRegex('tieba.baidu.com', /^\/p\/\d+$/),
        clean: cleanFactory.whitelist(new Set(['pn', 'see_lz', 'pid', 'cid'])),
    },
    {
        name: 'BestXTools',
        match: matchFactory.hostpath('links.bestxtools.com'),
        clean: url => url.pathname === '/' ? url : new URL(`https:/${url.pathname}${url.search}`),
    },
    {
        name: 'Coolapk',
        match: matchFactory.chain(
            matchFactory.hostpath('www.coolapk.com', '/link'),
            matchFactory.hasSearchParam('url'),
        ),
        clean: cleanFactory.urlDecodeSearchParam('url'),
    },
    {
        name: 'RSSing',
        match: matchFactory.hostpath('www.rssing.com', '/transit.php'),
        clean: cleanFactory.urlDecodeSearchParam('url'),
    },
    {
        name: 'Xiaohongshu',
        match: matchFactory.hostpathRegex('www.xiaohongshu.com', /^\/(?:discovery\/item|explore)\/[\da-f]+$/),
        clean: cleanFactory.whitelist(new Set(['xsec_token'])),
    },
    {
        name: 'Xiaohongshu (xhslink)',
        match: matchFactory.hostpath('xhslink.com', null),
        clean: cleanFactory.getRedirect,
    },
    {
        name: 'Vultr email link',
        match: matchFactory.hostpathRegex('experience.getvultr.com', /^\/[\dA-Za-z-_]+=*$/),
        clean: cleanFactory.chain(
            cleanFactory.getRedirectFromBody(s => s.match(/^\s*var redirecturl = '(.+?)';\s*$/m)[1]),
            cleanFactory.useHttps,
        ),
    },
    {
        name: 'Cloudflare email link',
        match: matchFactory.hostpathRegex('content.cloudflare.com', /^\/[\dA-Za-z-_]+=*$/),
        clean: cleanFactory.chain(
            cleanFactory.getRedirectFromBody(s => s.match(/^\s*var redirecturl = '(.+?)';\s*$/m)[1]),
            cleanFactory.useHttps,
        ),
    },
    {
        name: 'Cloudflare email link',
        match: matchFactory.hostpath('data.em2.cloudflare.com', '/ee/v1/click'),
        clean: cleanFactory.chain(
            cleanFactory.getRedirect,
            cleanFactory.blacklist(new Set(['correlationId'])),
        ),
    },
    {
        name: 'Weibo mobile status',
        match: matchFactory.hostpathRegex('m.weibo.cn', /^\/status\/\d+$/),
        clean: cleanFactory.whitelist(new Set),
    },
    {
        name: 'Dianping',
        match: matchFactory.hostpathRegex('m.dianping.com', /^\/shopshare\/[\dA-Za-z]+$/),
        clean: cleanFactory.whitelist(new Set),
    },
    {
        name: 'Cloudmusic',
        match: matchFactory.chain(
            matchFactory.hostpath(new Set(['music.163.com', 'y.music.163.com']), new Set(['/song', '/m/song'])),
            matchFactory.hasSearchParam('id'),
        ),
        clean: cleanFactory.whitelist(new Set(['id'])),
    },
    {
        name: 'NGA posts',
        match: matchFactory.chain(
            matchFactory.hostpath(new Set(['bbs.nga.cn', 'nga.178.com', 'ngabbs.com']), '/read.php'),
            matchFactory.hasSearchParam('tid'),
        ),
        clean: cleanFactory.whitelist(new Set(['tid', 'page'])),
    },
    {
        name: 'XQuan',
        match: matchFactory.chain(
            matchFactory.hostpath('xquan.net', '/linkfilter'),
            matchFactory.hasSearchParam('url'),
        ),
        clean: cleanFactory.urlDecodeSearchParam('url'),
    },
    {
        name: 'Pincong',
        match: matchFactory.hostpathRegex('pincong.rocks', /^\/url\/link\/(aHR0c(?:HM6|Dov)[\da-zA-Z\-_]+=*)$/),
        clean: url => new URL(atob(url.pathname.match(/^\/url\/link\/(aHR0c(?:HM6|Dov)[\da-zA-Z\-_]+=*)$/)[1].replace(/-/g, '+').replace(/_/g, '/'))),
    },
    {
        name: 'Xigua video',
        match: matchFactory.hostpath('www.ixigua.com', null),
        clean: cleanFactory.blacklist(new Set(['logTag', 'list_entrance', 'wid_try'])),
    },
    {
        name: 'WorldLink',
        match: matchFactory.hostpathRegex('www.worldlink.com.cn', /^(?:\/zh_tw|\/en)?\/link$/),
        clean: cleanFactory.urlDecodeSearchParam('target'),
    },
    {
        name: 'sina.lt',
        match: url => (new Set([
            't.hk.uy',
            'dwz.win',
            'tb.cn.hn',
            'jd.cn.hn',
            'dwz.date',
        ])).has(url.hostname) && /^\/[\da-zA-Z]+$/.test(url.pathname),
        clean: async url => {
            const resp = await fetch(url, {
                redirect: 'manual',
                credentials: globalThis.ENV === 'cfworker' ? undefined : 'omit',
            });
            if (resp.status === 301) {
                return globalThis.ENV === 'userscript' ? new URL(resp.url) : (resp.headers.has('location') ? new URL(resp.headers.get('location')) : url);
            } else {
                const body = await resp.text();
                return new URL(body.match(/<p class="url">(.+?)<\/p>/)[1]);
            }
        },
    },
    {
        name: 'V2Board afford',
        match: matchFactory.chain(
            matchFactory.hostpath(null, new Set(['/', '/index.php'])),
            url => url.hash.match(/^#\/register\?code=[A-Za-z\d]*$/),
        ),
        clean: url => {
            const u = new URL(url);
            u.hash = '#/register';
            return u;
        },
    },
    {
        name: 'SSPanel afford',
        match: matchFactory.chain(
            matchFactory.hostpath(null, '/auth/register'),
            matchFactory.hasSearchParam(new Set(['code', 'affid'])),
        ),
        clean: cleanFactory.blacklist(new Set(['code', 'affid'])),
    },
    {
        name: 'Qzone link',
        match: matchFactory.hostpath('mobile.qzone.qq.com', '/l'),
        clean: url => {
            const u = new URL('https://h5.qzone.qq.com/ugc/share/');
            u.searchParams.set('sharetag', url.searchParams.get('sharetag'));
            u.searchParams.set('appid', url.searchParams.get('a'));
            return u;
        },
    },
    {
        name: 'NodeSeek link',
        match: matchFactory.hostpath('www.nodeseek.com', '/jump'),
        clean: cleanFactory.urlDecodeSearchParam('to'),
    },
];
