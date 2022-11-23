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
      return j.$('h1.title').text().split('\n')[1].trim().split(' ').slice(0, -3).join(' ');
    },
    getIdentifier(url) {
      return utils.urlPart(url, 4).split('-').slice(0, -1).join('-');
    },
    getOverviewUrl(url) {
      return `${AnimeFenix.domain}/${AnimeFenix.sync.getIdentifier(url)}`;
    },
    getEpisode(url) {
      return parseInt(String(utils.urlPart(url, 4).split('-').at(-1)));
    },
    nextEpUrl(url) {
      return j.$('.fa-arrow-circle-right').parent('a').attr('href');
    },
  },
  overview: {
    getTitle(url) {
      // They are multiple h1 with class title
      return j.$('h1.title').text().split('\n')[0];
    },
    getIdentifier(url) {
      // ['https:', '', 'www.animefenix.tv','chainsaw-man]
      return utils.urlPart(url, 3);
    },
    uiSelector(selector) {
      j.$('section:nth-of-type(4)').before(j.html(selector));
    },
    list: {
      offsetHandler: false,
      elementsSelector() {
        return j.$('section > ul.anime-page__episode-list > li > a');
      },
      elementUrl(selector) {
        return utils.absoluteLink(selector.attr('href'), AnimeFenix.domain);
      },
      elementEp(selector) {
        return AnimeFenix.sync.getEpisode(AnimeFenix.overview!.list!.elementUrl!(selector));
      },
    },
    /* getMalUrl(provider) {
      const jikan = $('body')
        .html()
        .match(/api\.jikan\.moe\/v\d+\/anime\/(\d+)/im);

      if (jikan && jikan.length) {
        return `https://myanimelist.net/anime/${jikan[1]}`;
      }
      return false;
    }, */
  },
  init(page) {
    api.storage.addStyle(
      require('!to-string-loader!css-loader!less-loader!./style.less').toString(),
    );
    j.$(document).ready(function () {
      page.handlePage();
    });
  },
};
