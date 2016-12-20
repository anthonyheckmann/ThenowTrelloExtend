// Generated by CoffeeScript 1.12.2

/*
// ==UserScript==
// @name              Trello - Thenow Trello Extend
// @namespace         http://ejiasoft.com/
// @version           1.1.1
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
  var boardInit, curUrl, imgSwitch_click, listCardFormat, listFormatInit, listTitleFormat, pageRegex, showCardNum;

  pageRegex = {
    CardLimit: /\[\d+\]/,
    Category: /\{.+\}/g,
    User: /`\S+`/g,
    CardCount: /^\d+/,
    Number: /\d+/,
    CardNum: /^#\d+/,
    HomePage: /com[\/]$/
  };

  listCardFormat = function(objCard) {
    var cardCate, cardCategoryArray, cardTitle, cardUser, cardUserArray, i, j, len, len1, listCardTitle, trueUser;
    listCardTitle = objCard.find('a.list-card-title');
    cardTitle = listCardTitle.html();
    cardUserArray = cardTitle.match(pageRegex.User);
    cardCategoryArray = cardTitle.match(pageRegex.Category);
    if (cardUserArray !== null) {
      for (i = 0, len = cardUserArray.length; i < len; i++) {
        cardUser = cardUserArray[i];
        cardTitle = cardTitle.replace(cardUser, '');
        trueUser = cardUser.replace(/`/g, '');
        cardTitle += "<code>" + trueUser + "</code>";
      }
    }
    if (cardCategoryArray !== null) {
      for (j = 0, len1 = cardCategoryArray.length; j < len1; j++) {
        cardCate = cardCategoryArray[j];
        cardTitle = cardTitle.replace(cardCate, '');
        cardCate = cardCate.replace('{', '<code style="color:#0f9598">').replace('}', '</code>');
        cardTitle = cardCate + cardTitle;
      }
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

  showCardNum = function() {
    return $('span.card-short-id').each(function() {
      var curCardNum;
      curCardNum = $.trim($(this).text());
      return $(this).text(curCardNum + ' ').show();
    });
  };

  curUrl = window.location.href;

  boardInit = function() {
    if (pageRegex.HomePage.exec(curUrl) !== null) {
      return;
    }
    $('p.list-header-num-cards').show();
    showCardNum();
    listFormatInit();
    return imgSwitch_click();
  };

  $(function() {
    return setInterval((function() {
      curUrl = window.location.href;
      return boardInit();
    }), 1000);
  });

}).call(this);
