import cleanLink from './src/link-cleaner.js'
import { performance } from 'perf_hooks';

for (const testcase of [
    // 'https://hellogithub.com/periodical/statistics/click/?target=https://github.com/rvaiya/warpd&utm_source=test',
    // 'https://www.zhihu.com/search?q=pd2.0&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra=%7B%22sourceType%22%3A%22answer%22%2C%22sourceId%22%3A2485554266%7D',
    // 'https://link.zhihu.com/?target=https%3A//rust-lang.github.io/mdBook/',
    // 'https://www.baidu.com/s?tn=monline_7_dg&wd=%E4%B8%8A%E6%B5%B7%E5%85%A8%E5%B8%82%E7%A4%BE%E4%BC%9A%E9%9D%A2%E6%B8%85%E9%9B%B6&usm=2&ie=utf-8&rsv_pq=ef4e7eef0003f247&oq=%E4%B8%8A%E6%B5%B7%E5%85%A8%E5%B8%82%E7%A4%BE%E4%BC%9A%E9%9D%A2%E6%B8%85%E9%9B%B6&rsv_t=ecdeuCil9AREMuRn3ZsOG9LOb%2FyokzL7QyBu2rYtquhxRweb%2Fy824ZZH7xPF%2FtBgKQcf&rqid=ef4e7eef0003f247&rsf=eb63b4d0f9f94b728c87d7f08d6dfcae_1_15_2&rsv_dl=0_right_fyb_pchot_20811&sa=0_right_fyb_pchot_20811',
    // 'https://ld246.com/forward?goto=https%3A%2F%2Fzh.wikipedia.org%2Fwiki%2F%25E8%258E%25AB%25E6%25AF%2594%25E4%25B9%258C%25E6%2596%25AF%25E5%25B8%25A6',
    // 'https://www.youtube.com/redirect?event=video_description&redir_token=QUFFLUhqa0luZWlKTDJxV0g3S3U5Mktpa1VOTmtnZ3VzQXxBQ3Jtc0ttVDNES2JKY0RUdkk4NVNjdlNhS04xYy10VUNXVnhnOTBhRnRLQXdJV3FkRHZ3aXRSQ291U013M05HR0dUeFd1eHRXNG1GRTlweUExbVAzYk9hTzhFcU81emlNcG1Kc2p4RGsweVZwUFZvQ2l6NXE3RQ&q=https%3A%2F%2Ftwitter.com%2FPEPPER_777&v=xyD0BQxh2ms',
    // 'https://link.segmentfault.com/?enc=Rbh8pMHUW0OMVw4Qy4zzhA%3D%3D.v3sI89Q8ZV94G4pZn0OPLolA2ILUp%2FKGzzdQZ%2BGN2L8%3D',
    // 'https://b23.tv/f6uaCgy',
    // 'https://b23.tv/r15682i',
    // 'https://b23.tv/w1Cnj0',
    // 'https://weibo.cn/sinaurl?u=https%3A%2F%2Fwww.bilibili.com%2Fvideo%2FBV1f5411978t%3Fp%3D1%26share_medium%3Diphone%26share_plat%3Dios%26share_session_id%3D676A1B0A-CA50-4DAD-B1DF-9BCB569560B2%26share_source%3DSINA%26share_tag%3Ds_i%26timestamp%3D1652785055%26unique_k%3DaehUD2u',
    // 'https://c.pc.qq.com/middlem.html?pfurl=https://example.com',
    // 'http://s.zhihu.com/DawiA',
    // 'http://zhi.hu/BDXoI',
    // 'https://curl.qcloud.com/mlSxeotg',
    // 'https://www.vultr.com/?ref=6809598',
    // 'https://www.linode.com/?r=6226223ca39970b7ee1b06b3c79015a9b80aef88',
    // 'https://m.do.co/c/6b173b2d7e5e',
    // 'https://qinlili.bid/redirect.html?target=https://greasyfork.org/zh-CN/users/455225-qinlili23333',
    // 'https://weixin110.qq.com/cgi-bin/mmspamsupport-bin/newredirectconfirmcgi?main_type=1&evil_type=100&source=2&bancode=9e6575d90e213289f4cb9e9407648472a099ba671a74cffc599b483c2bbcc110c0e6d18b3397d39317f905f44f68a256&scene=45&devicetype=iOS14.2&click=fae13ab58cc731ee6445e46f88d754e5',
    // 'https://outgoing.prod.mozaws.net/v1/d01b4e0d4529405f12016274ffeec95d98ef36bd9bfc37210e3cd0b4aae3fd19/https%3A//github.com/filips123/PWAsForFirefox',
    // 'https://bwh81.net/aff.php?aff=46048&pid=87',
    // 'https://bwh89.net/aff.php?aff=13457',
    // 'https://manage.hostdare.com/aff.php?aff=1945&pid=74',
    // 'https://clientarea.gigsgigscloud.com/?affid=1263&cmd=cart&action=add&id=333',
    // 'https://www.oschina.net/action/GoToLink?url=https%3A%2F%2Fseanlook.com%2F2015%2F12%2F14%2Fmysql-replicas%2F',
    // 'https://www.360doc.cn/outlink.html?url=https://quote.cfi.cn/quote_600519.html',
    // 'https://jump2.bdimg.com/safecheck/index?url=rN3wPs8te/pjz8pBqGzzzz3wi8AXlR5g1NgdDpM6gxIAXd05dt3m/x7iiUNBMf1rkVvOVeukx+fZa0Sr789sq5GvedOpCizeTDeOnqzMKitN/uxEXeos4Y5iD94p2hXY2AgCtjpDKkO+gYGq1Czi81SWSJ8XLuLbfSBwGF9mAgJ2Pah4egTNMg==',
    // 'https://afdian.net/link?target=https%3A%2F%2Fexample.com',
    // 'https://mail.qq.com/cgi-bin/readtemplate?t=safety&check=false&gourl=https://example.com/&subtemplate=gray&evil=0',
    // 'https://docs.qq.com/scenario/link.html?url=https%3A%2F%2Fnyaa.si',
    // 'https://steamcommunity.com/linkfilter/?url=https://www.bilibili.com/read/cv300189/',
    // 'https://ref.gamer.com.tw/redir.php?url=https%3A%2F%2Fexample.com',
    // 'https://zhangge.net/goto/aHR0cHM6Ly9hcGlzaXguYXBhY2hlLm9yZy9kb2NzL2FwaXNpeC9wbHVnaW5zL3Jlc3BvbnNlLXJld3JpdGU=',
    // 'https://zhangge.net/go/?url=https://example.com',
    // 'https://p3terx.com/go/aHR0cHM6Ly93d3cudnVsdHIuY29tLz9yZWY9NzEzMzE2OQ',
    // 'https://blog.zeruns.tech/index.php/go/aHR0cHM6Ly9jbi5ncmF2YXRhci5jb20vYXZhdGFyLw==',
    // 'https://zouaw.com/go/tencent',
    // 'https://wpjam.com/go/aliyun/',
    // 'https://v2ex.com/go/js',
    // 'https://www.baidu.com/link?url=fpYJSbnDhK867l5Ctb6jjOb4BH_KqCETFri8JnJFdAoUyCFfDGIvLRvPu7h8mW4u&wd=&eqid=ec2b1e6e000023dd0000000662a802c4',
    // 'https://u.jd.com/cwhrQ84',
    // 'https://u.jd.com/cMZhON0',
    // 'http://tieba.baidu.com/p/3800199796?share=9105&fr=sharewise&see_lz=0&share_from=post&sfc=copy&client_type=2&client_version=12.24.0.1&st=1657158837&is_video=false&unique=712AAD1A2D03D4C8B53BD8CFAE19ECA7',
    // 'https://bbs.1ove.club/gowild.htm?url=https_3A_2F_2Fwww_2ealiyundrive_2ecom_2Fs_2FSsDm36JPK1G&u=114514&fr=https_3A_2F_2Fbbs_2e1ove_2eclub_2Fthread_2d28871_2ehtm',
    // 'https://go.smzdm.com/b3ebe5a7067eb9af/ab_cd_ef_012_34567890_12345_6789_0123_4',
    'https://dwz.win/wmQ',
    'https://t.hk.uy/a7rP',
]) {
    try {
        console.log(`\x1b[36mTest case:\x1b[0m ${testcase}`);
        const ts = performance.now();
        const cleaned = await cleanLink(testcase, true);
        const te = performance.now();
        console.log(`\x1b[92mCleaned:\x1b[0m ${cleaned}`);
        console.log(`\x1b[95mTime:\x1b[0m ${(te - ts).toFixed(2)}ms`);
    } catch (err) {
        console.log(`\x1b[36mTest case:\x1b[0m ${testcase}`);
        console.warn(`\x1b[91mFailed:\x1b[0m ${err.stack}`);
    } finally {
        console.log();
    }
}
