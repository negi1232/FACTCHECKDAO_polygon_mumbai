function generateFactCheckData(quantity) {
    const titles = ["COVID-19ワクチンの副作用に関する情報の真偽をチェック", "地球温暖化の影響に関するデマを検証", "SNSで広まった食品添加物に関するフェイクニュースの検証", "政治家の発言についての真偽をチェック", "ネット上で話題の健康法についての真実を明らかにする"];

    const descriptions = [
        "COVID-19ワクチンの接種後の副反応に関する情報が広まっていますが、その真偽を検証します。",
        "地球温暖化に関するデマが広まっていますが、科学的な事実に基づいて検証します。",
        "食品添加物に関する情報がSNSで拡散されていますが、その信憑性を確認します。",
        "政治家の発言には真偽が混在しています。私たちがその真相を明らかにします。",
        "インターネット上で話題の健康法についての情報の信憑性を検証します。",
    ];

    const details = [
        "COVID-19ワクチンの副作用については、科学的な研究に基づいたデータをもとに、副作用の有無とそのリスクについて解説します。",
        "地球温暖化の影響については、気候変動のデータと科学的な研究結果に基づいて、極端な天候現象や海面上昇などの影響を解説します。",
        "食品添加物に関する情報には多くの誤解があります。私たちが添加物の種類や安全性について詳しく説明します。",
        "政治家の発言には事実誤認や誇張が含まれる場合があります。私たちが公的なデータや報道のチェックを通じて真相を明らかにします。",
        "ネット上ではさまざまな健康法が紹介されていますが、科学的な根拠に基づいた効果やリスクを解説します。",
    ];

    const thumbnail_urls = [
        "https://1.bp.blogspot.com/-tVeC6En4e_E/X96mhDTzJNI/AAAAAAABdBo/jlD_jvZvMuk3qUcNjA_XORrA4w3lhPkdQCNcBGAsYHQ/s1048/onepiece01_luffy.png",
        "https://1.bp.blogspot.com/-rzRcgoXDqEg/YAOTCKoCpPI/AAAAAAABdOI/5Bl3_zhOxm07TUGzW8_83cXMOT9yy1VJwCNcBGAsYHQ/s1041/onepiece02_zoro_bandana.png",
        "https://1.bp.blogspot.com/-2ut_UQv3iss/X-Fcs_0oAII/AAAAAAABdD8/jrCZTd_xK-Y6CP1KwOtT_LpEpjp-1nvxgCNcBGAsYHQ/s1055/onepiece03_nami.png",
        "https://1.bp.blogspot.com/-mZpzgXC1Sxk/YAOTCAKwWTI/AAAAAAABdOM/5B4hXli0KLU5N-BySHgjVbhZscKLSE-bQCNcBGAsYHQ/s1025/onepiece04_usopp_sogeking.png",
        "https://1.bp.blogspot.com/-HPG_x7XPky8/X-FctLTLkKI/AAAAAAABdEE/xs4T8m0FiBAFptXHGQhQ2c9ZmVWtaeQSgCNcBGAsYHQ/s1028/onepiece05_sanji.png",
    ];

    const deadline = new Date().getTime() / 1000 - 60 * 60 * 24 * 7;
    const created_at = new Date().getTime() / 1000 + 60 * 60 * 24 * 7;
    const reward = Math.floor(Math.random() * 1000);

    let factCheckDatas = [];

    for (let i = 0; i < quantity; i++) {
        const randomIndex = Math.floor(Math.random() * titles.length);
        const factCheckData = {
            args: {
                title: titles[randomIndex],
                description: descriptions[randomIndex],
                details: details[randomIndex],
                thumbnail_url: thumbnail_urls[randomIndex],
                deadline: deadline,
                created_at: created_at,
                reward: reward,
                author: "0x09D47D4179cE7A0532Fdb525aacEa95D87E9e412",
            },
        };
        factCheckDatas.push(factCheckData);
    }

    return factCheckDatas;
}

export default generateFactCheckData;
