import { pageInterface } from '../pageInterface';

export const AnimeFenix: pageInterface = {
  name: 'AnimeFenix',
  domain: 'https://www.animefenix.com',
  languages: ['Spanish'],
  type: 'anime',
  isSyncPage(url) {
    // ['https:', '', 'www.animefenix.tv', 'ver', 'chainsaw-man-1']
    return utils.urlPart(url, 3) === 'ver';
  },
  isOverviewPage(url) {
    return AnimeFenix.overview!.getTitle(url).length > 0;
  },
  sync: {
    getTitle(url) {
      // Assuming title to be like "anime chapter Sub Español"
      return j.$('h1.title').text().split('\n')[1].trim().split(' ').slice(0,-3).join(' ');
    },
    getIdentifier(url) {
      return utils.urlPart(url, 3);
    },
    getOverviewUrl(url) {
      return AnimeFenix.domain + (j.$('.fa-th-list').attr('href') || '');
    },
    getEpisode(url) {
      return parseInt(j.$('h2.SubTitle').text().replace('Episodio ', '').trim());
    },
    nextEpUrl(url) {
      const nextEp = j.$('.fa-chevron-right').attr('href');
      if (!nextEp) return nextEp;
      return AnimeFenix.domain + nextEp;
    },
    uiSelector(selector) {
      j.$('.CapOptns').after(j.html(selector));
    },
  },
  overview: {
    getTitle(url) {
      // They are multiple h1 with class title
      return j.$('h1.title').text().split('\n')[0];
    },
    getIdentifier(url) {
      return utils.urlPart(url, 4);
    },
    uiSelector(selector) {
      j.$('.Description').after(j.html(selector));
    },
    list: {
      offsetHandler: false,
      elementsSelector() {
        const url = window.location.href;
        document.body.insertAdjacentHTML(
          'afterbegin',
          '<div id="MALSync" class="MALSync" style="display: none;"><ul id="MALSyncUl" class="MALSyncUl"></ul></div>',
        );
        const idMALSync = document.getElementById('MALSyncUl');
        const patron = /<script>\s\s {3}var([^]*?)<\/script>/g;
        const html = document.body.innerHTML;
        let scriptEps = patron.exec(html);
        if (scriptEps !== null) {
          // @ts-ignore
          scriptEps = scriptEps[1] || null;
          if (scriptEps !== null) {
            // @ts-ignore
            const patron2 = /\[([^[\]]{0,10},{0,10})\]/g;
            // @ts-ignore
            const eps = scriptEps.toString().match(patron2);
            if (eps !== null) {
              // @ts-ignore
              eps.forEach(element => {
                if (idMALSync !== null) {
                  const Url = `${AnimeFenix.domain}/ver/${utils.urlPart(url, 4)}-${element
                    .split(',')[0]
                    .replace('[', '')}`;
                  const Episodio = element.split(',')[0].replace('[', '');
                  idMALSync.innerHTML += j.html(
                    `<li><a href="${Url}" epi="${Episodio}"></a> </li>`,
                  );
                }
              });
            }
          }
        }
        return j.$('.MALSync a');
      },
      elementUrl(selector) {
        return utils.absoluteLink(selector.attr('href'), AnimeFenix.domain);
      },
      elementEp(selector) {
        return Number(selector.attr('epi'));
      },
      handleListHook(epi, epilist) {
        epi++;
        if (epilist.length - 1 >= epi) {
          const cover = j.$('.AnimeCover img').attr('src');
          const name = j.$('.Container h2').text();
          const epiAct = `<li class="fa-play-circle Next"><a href="${epilist[
            epi
          ][0].toString()}"><figure><img src="${cover}" alt=""></figure><h3 class="Title">${name}</h3><p>Episodio ${epi}</p><span style="position: absolute; top: 0; bottom: 0; margin: auto; right: 20px; line-height: 30px; font-size: 16px; font-weight: 700; height: 30px;">Siguiente Episodio</span></a></li>`;
          j.$('.Main .ListCaps').prepend(j.html(epiAct));
        }
      },
    },
  },
  init(page) {
    api.storage.addStyle(
      require('!to-string-loader!css-loader!less-loader!./style.less').toString(),
    );
    if (document.title === 'Verifica que no eres un bot | AnimeFLV') {
      con.log('loading');
      page.cdn();
      return;
    }
    if (window.location.hostname.startsWith('m.')) {
      con.error('Mobile not supported');
      return;
    }
    j.$(document).ready(function () {
      page.handlePage();
    });
  },
};
