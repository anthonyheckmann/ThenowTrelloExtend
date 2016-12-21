// Generated by CoffeeScript 1.12.2

/*
// ==UserScript==
// @name              Trello - Thenow Trello Extend
// @namespace         http://ejiasoft.com/
// @version           1.1.2
// @description       Extend trello.com
// @description:zh-CN 扩展trello.com看板的功能
// @homepageurl       https://github.com/thenow/ThenowTrelloExtend
// @author            thenow
// @run-at            document-end
// @license           MIT license
// @match             http*://*trello.com
// @match             http*://*trello.com/*
// @grant             none
// ==/UserScript==
 */

(function() {
  var boardInit, cardLabelCss, curUrl, imgSwitch_click, listCardFormat, listFormatInit, listTitleFormat, pageRegex;

  pageRegex = {
    CardLimit: /\[\d+\]/,
    Category: /\{.+\}/g,
    User: /`\S+`/g,
    CardCount: /^\d+/,
    Number: /\d+/,
    CardNum: /^#\d+/,
    HomePage: /com[\/]$/
  };

  cardLabelCss = "<style type=\"text/css\">\n    .list-card-labels .card-label {\n        font-weight: normal;\n        font-size: 10px;\n        height: 12px !important;\n        line-height: 10px !important;\n        padding: 0 3px;\n        margin: 0 3px 0 0;\n        text-shadow: none;\n        width: auto;\n        max-width: 50px;\n    }\n    .card-short-id {\n        display: inline;\n        font-weight: bold;\n    }\n    .card-short-id:after {\n        content:\" \";\n    }\n</style>";

  listCardFormat = function(objCard) {
    var cardCate, cardCategoryArray, cardTitle, cardUser, cardUserArray, categoryStringArray, i, j, len, len1, listCardTitle, userStringArray;
    listCardTitle = objCard.find('a.list-card-title').filter(':last');
    cardTitle = listCardTitle.html();
    cardUserArray = cardTitle.match(pageRegex.User);
    cardCategoryArray = cardTitle.match(pageRegex.Category);
    if (cardUserArray !== null) {
      userStringArray = [];
      for (i = 0, len = cardUserArray.length; i < len; i++) {
        cardUser = cardUserArray[i];
        cardTitle = cardTitle.replace(cardUser, '');
        userStringArray.push("<code>" + (cardUser.substring(1, cardUser.length - 1)) + "</code>");
      }
      cardTitle += userStringArray.join('');
    }
    if (cardCategoryArray !== null) {
      categoryStringArray = [];
      for (j = 0, len1 = cardCategoryArray.length; j < len1; j++) {
        cardCate = cardCategoryArray[j];
        cardTitle = cardTitle.replace(cardCate, '');
        categoryStringArray.push("<code style=\"color:#0f9598\">" + (cardCate.substring(1, cardCate.length - 1)) + "</code>");
      }
      cardTitle += categoryStringArray.join('');
    }
    return listCardTitle.html(cardTitle);
  };

  listTitleFormat = function(objList) {
    var cardCount, cardLimit, cardLimitInfo, curCardCountP, curListHeader, curListTitle;
    curListHeader = objList.find('div.list-header');
    curListTitle = curListHeader.find('textarea.list-header-name').val();
    cardLimitInfo = pageRegex.CardLimit.exec(curListTitle);
    if (cardLimitInfo === null) {
      return false;
    }
    curCardCountP = curListHeader.find('p.list-header-num-cards');
    cardCount = pageRegex.CardCount.exec(curCardCountP.text())[0];
    cardLimit = pageRegex.Number.exec(cardLimitInfo[0])[0];
    if (cardCount > cardLimit) {
      return objList.css('background', '#903');
    } else if (cardCount === cardLimit) {
      return objList.css('background', '#c93');
    } else {
      return objList.css('background', '#e2e4e6');
    }
  };

  listFormatInit = function() {
    return $('div.list').each(function() {
      listTitleFormat($(this));
      return $(this).find('div.list-card').each(function() {
        return listCardFormat($(this));
      });
    });
  };

  imgSwitch_click = function() {
    var imgSwitch;
    if ($('#btnImgSwitch').length > 0) {
      return;
    }
    imgSwitch = $('<a id="btnImgSwitch" class="board-header-btn board-header-btn-org-name board-header-btn-without-icon"><span class="board-header-btn-text">隐藏/显示图片</span></a>');
    $('div.board-header').append(imgSwitch);
    return imgSwitch.click(function() {
      return $('div.list-card-cover').slideToggle();
    });
  };

  curUrl = window.location.href;

  boardInit = function() {
    if (pageRegex.HomePage.exec(curUrl) !== null) {
      return;
    }
    $('p.list-header-num-cards').show();
    listFormatInit();
    return imgSwitch_click();
  };

  $(function() {
    $('head').append(cardLabelCss);
    return setInterval((function() {
      curUrl = window.location.href;
      return boardInit();
    }), 1000);
  });

}).call(this);
