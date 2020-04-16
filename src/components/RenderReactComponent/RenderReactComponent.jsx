import { IntlProvider } from 'react-intl';
import { getLang, isoCodeToLocale } from 'services/AppUtils';
import React from 'react';
import { render } from 'react-dom';
import TranslationStore from 'stores/TranslationStore';
import ServerActionCreators from 'actions/ServerActionCreators';

const lang = getLang();
const locale = isoCodeToLocale(lang);
const queueOfReactComponentsToDisplay = [];
let isTranslationLoading = false;

function renderView(...args) {
  const [Component, mountNode, props] = args;

  render(
    <IntlProvider locale={locale} messages={TranslationStore.translations}>
      <Component {...props} />
    </IntlProvider>,
    mountNode
  );
}

function getTranslations() {
  let __RequestVerificationToken = '';
  const elem = document.getElementsByName('__RequestVerificationToken');
  if (elem !== undefined && elem.length > 0) {
    __RequestVerificationToken = elem[0].value;
  }
  const headers = new Headers({
    __RequestVerificationToken,
  });

  isTranslationLoading = true;

  fetch(`/messages.json?culture=${locale}`, {
    credentials: 'same-origin',
    headers,
  })
    .then(response => response.json())
    .then(json => {
      ServerActionCreators.receiveGetTranslations(json, null);
      window.Messages = json;
      isTranslationLoading = false;
      queueOfReactComponentsToDisplay.forEach(componentItem => {
        renderView(...componentItem);
      });
    });
}

function renderReactComponent(...args) {
  function renderViewWithLocalizations() {
    if (TranslationStore.isInit()) {
      renderView(...args);
    } else {
      if (window.Messages == null && !isTranslationLoading) {
        getTranslations();
      }

      queueOfReactComponentsToDisplay.push(args);
    }
  }

  if (global.Intl) {
    renderViewWithLocalizations();
  } else {
    require.ensure(
      [
        'intl',
        'intl/locale-data/jsonp/ca',
        'intl/locale-data/jsonp/de',
        'intl/locale-data/jsonp/en',
        'intl/locale-data/jsonp/es',
        'intl/locale-data/jsonp/eu',
        'intl/locale-data/jsonp/fr',
        'intl/locale-data/jsonp/it',
      ],
      require => {
        require('intl');
        require('intl/locale-data/jsonp/ca');
        require('intl/locale-data/jsonp/de');
        require('intl/locale-data/jsonp/en');
        require('intl/locale-data/jsonp/es');
        require('intl/locale-data/jsonp/eu');
        require('intl/locale-data/jsonp/fr');
        require('intl/locale-data/jsonp/it');
        renderViewWithLocalizations();
      }
    );
  }
}

export { getTranslations, renderReactComponent };
