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
            'mkt_tok',
            'spm',
            'spm_id_from',
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
            'utm_term',
            'utm_member',
            'utm_oi',
            'vd_source',
        ])),
        clean: cleanFactory.blacklist(new Set([
            'mkt_tok',
            'spm',
            'spm_id_from',
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
            'utm_term',
            'utm_member',
            'utm_oi',
            'vd_source',
        ])),
    },
    {
        name: 'Zhihu/Juejin/CSDN link',
        match: matchFactory.hostpath(new Set(['link.zhihu.com', 'link.juejin.cn', 'link.csdn.net']), '/'),
        clean: cleanFactory.urlDecodeSearchParam('target'),
    },
    {
        name: 'KDocs link',
        match: matchFactory.hostpath('www.kdocs.cn', '/office/link'),
        clean: cleanFactory.urlDecodeSearchParam('target'),
    },
    {
        name: 'sspai link',
        match: matchFactory.hostpath('sspai.com', '/link'),
        clean: cleanFactory.urlDecodeSearchParam('target'),
    },
    {
        name: 'Jianshu link',
        match: matchFactory.hostpath('link.jianshu.com', '/'),
        clean: cleanFactory.urlDecodeSearchParam('t'),
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
        name: 'Afdian/Gitee link',
        match: matchFactory.hostpath(new Set(['afdian.net', 'gitee.com']), '/link'),
        clean: cleanFactory.urlDecodeSearchParam('target'),
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
        name: 'QQ docs link',
        match: matchFactory.hostpath('docs.qq.com', '/scenario/link.html'),
        clean: cleanFactory.urlDecodeSearchParam('url'),
    },
    {
        name: 'Youtube link',
        match: matchFactory.hostpath('www.youtube.com', '/redirect'),
        clean: cleanFactory.urlDecodeSearchParam('q'),
    },
    {
        name: 'Steam community link',
        match: matchFactory.hostpath('steamcommunity.com', '/linkfilter/'),
        clean: cleanFactory.urlDecodeSearchParam('url'),
    },
    {
        name: 'GamerTW link',
        match: matchFactory.hostpath('ref.gamer.com.tw', '/redir.php'),
        clean: cleanFactory.urlDecodeSearchParam('url'),
    },
    {
        name: 'Hellogithub link',
        match: matchFactory.hostpath('hellogithub.com', '/periodical/statistics/click/'),
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
        name: 'Weibo short link',
        match: matchFactory.hostpath('weibo.cn', '/sinaurl'),
        clean: cleanFactory.urlDecodeSearchParam('u'),
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
        name: 'b23.tv short link',
        match: matchFactory.hostpath('b23.tv', null),
        clean: cleanFactory.chain(
            cleanFactory.getRedirect,
            cleanFactory.blacklist(new Set(['timestamp'])),
        ),
    },
    {
        name: 'Bilibili video',
        match: matchFactory.hostpathRegex('www.bilibili.com', /^\/video\/[Bb][Vv][A-HJ-NP-Za-km-z1-9]{10}\/?$/),
        clean: cleanFactory.chain(
            cleanFactory.whitelist(new Set),
            cleanFactory.bv2av,
        ),
    },
    {
        name: 'Douyin link',
        match: matchFactory.hostpath('www.douyin.com', null),
        clean: cleanFactory.blacklist(new Set([
            'enter_from',
            'enter_method',
            'extra_params',
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
        name: 'QQ middlem',
        match: matchFactory.hostpath('c.pc.qq.com', '/middlem.html'),
        clean: cleanFactory.urlDecodeSearchParam('pfurl'),
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
        clean: cleanFactory.whitelist(new Set(['__biz', 'mid', 'idx', 'sn'])),
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
        clean: cleanFactory.blacklist(new Set([
            'app_platform',
            'app_version',
            'share_from_user_hidden',
            'type',
            'xhsshare',
            'appuid',
            'apptime',
        ])),
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
];
