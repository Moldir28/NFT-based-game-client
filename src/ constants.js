const CONTRACT_ADDRESS = '0xbFb408f980BF61Fcea4971c4b1FCf2c1826A1CF1';

const transformCharacterData = (characterData) => {
    return {
        name: characterData.name,
        imageURI: characterData.imageURI,
        hp: characterData.hp.toNumber(),
        maxHp: characterData.maxHp.toNumber(),
        attackDamage: characterData.attackDamage.toNumber(),
    };
};

export { CONTRACT_ADDRESS, transformCharacterData };