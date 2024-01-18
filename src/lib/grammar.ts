export const vowels = ['а', 'е', 'ё', 'и', 'о', 'у', 'ы', 'э', 'ю', 'я'];
export const consonants = ['б', 'в', 'г', 'д', 'ж', 'з', 'к', 'л', 'м', 'н', 'п', 'р', 'с', 'т', 'ф', 'х', 'ц', 'ч', 'ш', 'щ'];
const stopWords = ['ёб', 'еб'];

export const allCombinations:string[] = [];
vowels.forEach((v) => {
  consonants.forEach((c) => {
    allCombinations.push(v + c);
    allCombinations.push(c + v);
  });
});

export const getSyllable = ():string => {
  const vowel = vowels[Math.floor(Math.random() * vowels.length)];
  const consonant = consonants[Math.floor(Math.random() * consonants.length)];
  const res = Math.random() > 0.3 ? `${consonant}${vowel}` : `${vowel}${consonant}`;
  return stopWords.includes(res) ? getSyllable() : res;
};
