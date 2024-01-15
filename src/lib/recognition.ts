import { allCombinations } from './grammar';

interface IWindow extends Window {
  webkitSpeechRecognition: any;
  webkitSpeechGrammarList: any;
}
const { webkitSpeechRecognition, webkitSpeechGrammarList } : IWindow = <IWindow><unknown>window;

const grammar = `#JSGF V1.0; grammar syllables; public <syllable> = ${allCombinations.join(' | ')} ;`;
// eslint-disable-next-line new-cap
export const recognition = typeof webkitSpeechRecognition !== 'undefined' ? new webkitSpeechRecognition() : undefined;

// eslint-disable-next-line new-cap
export const speechRecognitionList = new webkitSpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;
recognition.continuous = false;
recognition.lang = 'ru-RU';
recognition.interimResults = true;
recognition.maxAlternatives = 3;
