import { useState, useEffect } from 'react';
import LuckData from '../data/luckData';
import TiersData from '../data/tiersData';

export default function App() {
  const luckProbabilites = LuckData.luckProbabilities;
  const tiers = TiersData.tiers;
  const [cardQuantities, setCardQuantities] = useState(() => {
    const initialQuantities = {};
    tiers.forEach(tier => {
      tier.cards.forEach(card => {
        initialQuantities[`${tier.id}-${card.id}`] = 0;
      });
    });
    return initialQuantities;
  });
  const [openingPack, setOpeningPack] = useState(false);
  const [cardsObtained, setCardsObtained] = useState([]);
  const [luckLevel, setLuckLevel] = useState(0);
  const [packsOpened, setPacksOpened] = useState(0);
  const [levelUp, setLevelUp] = useState(false);
  const [collectionPercentage, setCollectionPercentage] = useState(0);
  const [ascensionLevel, setAscensionLevel] = useState(0);
  const [showInformation, setShowInformation] = useState(false);
  const [cardsObtainedIndex, setCardsObtainedIndex] = useState(0);

  function handleOpenPack() {
    setOpeningPack(true);
    setPacksOpened(prev => prev + 1);
    const cardsToObtain = luckLevel + 2 + ascensionLevel;
    for (let i = 0; i < cardsToObtain; i++) {
      const randomNum = Math.random();
      let randomTier;
      if (randomNum < luckProbabilites[luckLevel][0]) {
        randomTier = 0;
      } else if (randomNum < luckProbabilites[luckLevel][1]) {
        randomTier = 1;
      } else if (randomNum < luckProbabilites[luckLevel][2]) {
        randomTier = 2;
      } else {
        randomTier = 3;
      }
      let randomCard = Math.floor(Math.random() * tiers[randomTier].cards.length);
      let choseCard = `${randomTier}-${randomCard}`;
      setCardsObtained(prev => [...prev, choseCard]);
      setCardQuantities(prev => ({
        ...prev,
        [choseCard]: prev[choseCard] + 1
      }));
    }
  }

  function checkLuckLevelUp() {
    let levelUp = false;
    if (luckLevel < 3) {
      for (let i = 0; i < tiers[luckLevel].cards.length; i++) {
        if (cardQuantities[`${luckLevel}-${i}`] === 0) {
          levelUp = false;
          break;
        } else {
          levelUp = true;
        }
      }
    }
    if (levelUp) {
      setLuckLevel(prev => prev + 1);
      setLevelUp(true);
    }
  }

  function handleCloseOpeningPack() {
    checkLuckLevelUp();
    checkCollectionPercentage();
    setOpeningPack(false);
    setCardsObtained([]);
    setCardsObtainedIndex(0);
  }

  function checkCollectionPercentage() {
    let cardsObtained = 0;
    for (let key in cardQuantities) {
      if (cardQuantities[key] !== 0) {
        cardsObtained++;
      }
    }
    setCollectionPercentage(Math.round((cardsObtained / Object.keys(cardQuantities).length) * 100));
  }

  function ascend() {
    if (collectionPercentage === 100) {
      setAscensionLevel(prev => prev + 1);
      setLuckLevel(0);
      setCollectionPercentage(0);
      setCardQuantities(() => {
        const initialQuantities = {};
        tiers.forEach(tier => {
          tier.cards.forEach(card => {
            initialQuantities[`${tier.id}-${card.id}`] = 0;
          });
        });
        return initialQuantities;
      });
    }
  }

  return (
    <div className="app">
      <div className="title">CARD REALM</div>
      <div className="cards-collection">
        {tiers.map((tier) => (<Tier key={tier.id} tier={tier} cardQuantities={cardQuantities} />))}
        <OpenCardsPack openPack={handleOpenPack} luckLevel={luckLevel} luckProbabilities={luckProbabilites} openPacksDisabled={openingPack} collectionPercentage={collectionPercentage} packsOpened={packsOpened} ascend={ascend} ascensionLevel={ascensionLevel} showInformation={showInformation} setShowInformation={setShowInformation} />
      </div>
      <ShowCardsObtained openingPack={openingPack} closeOpeningPack={handleCloseOpeningPack} tiers={tiers} cardsObtained={cardsObtained} cardsObtainedIndex={cardsObtainedIndex} setCardsObtainedIndex={setCardsObtainedIndex} />
      <ShowLevelUp levelUp={levelUp} setLevelUp={setLevelUp} luckLevel={luckLevel} />
      <ShowInformation showInformation={showInformation} setShowInformation={setShowInformation} />
    </div>
  );
}

function Tier({ tier, cardQuantities }) {
  return (
    <div className="tier">
      <div className={`tier-title ${getTierColor(tier.id)}`}>{tier.name}</div>
      <div className="cards">
        {tier.cards.map((card) => (<Card key={tier.id + "-" + card.id} tier={tier.id} card={card} quantity={cardQuantities[`${tier.id}-${card.id}`]} />))}
      </div>
    </div>
  );
}

function Card({ tier, card, quantity }) {
  return (
    <>
      {quantity !== 0 ?
        <div>
          <div className={`card ${getTierColor(tier)}`}>
            <div className="card-discovered-img-div">
              <img className="card-discovered-img" src={`/img/gems/${card.name}.png`} alt={`${card.name}.png`} />
            </div>
            <h2 className="card-title">{card.name}</h2>
          </div>
          <CardCounter quantity={quantity} />
        </div>
        :
        <div>
          <div className="card card-not-discovered">
            <img className="card-not-discovered-img" src="/img/unknown.png" alt="Card not discovered" />
          </div>
          <CardCounter quantity={quantity} />
        </div>
      }
    </>
  );
}

function getTierColor(tier) {
  switch (tier) {
    case 0:
      return "tier-common";
    case 1:
      return "tier-uncommon";
    case 2:
      return "tier-rare";
    case 3:
      return "tier-super-rare";
    default:
      return "";
  }
}

function CardCounter({ quantity }) {
  return (
    <div className="card-counter">
      <div>{quantity}</div>
    </div>
  )
}

function OpenCardsPack({ openPack, luckLevel, luckProbabilities, openPacksDisabled, collectionPercentage, packsOpened, ascend, ascensionLevel, setShowInformation }) {
  return (
    <div className="open-packs">
      <button className="open-packs-button" onClick={() => openPack(luckLevel)} disabled={openPacksDisabled}>OPEN PACKS</button>
      <div className='open-packs-details'>
        <ul>
          <li>Luck Level: <span>{luckLevel < 3 ? luckLevel + 1 : "MAX"}</span></li>
          <li>Ascension Level: <span>{ascensionLevel}</span></li>
          <li>Cards obtained by pack: <span>{`${luckLevel + 2 + ascensionLevel} (1 + ${luckLevel + 1} + ${ascensionLevel})`}</span></li>
          <li>Probability of Tier C: <span>{luckProbabilities[luckLevel][0] * 100}%</span></li>
          <li>Probability of Tier U: <span>{(luckProbabilities[luckLevel][1] * 100 - luckProbabilities[luckLevel][0] * 100)}%</span></li>
          <li>Probability of Tier R: <span>{(luckProbabilities[luckLevel][2] * 100 - luckProbabilities[luckLevel][1] * 100)}%</span></li>
          <li>Probability of Tier SR: <span>{(100 - luckProbabilities[luckLevel][2] * 100)}%</span></li>
          <li>Collection percentage: <span>{collectionPercentage}%</span></li>
          <li>Total open packs: <span>{packsOpened}</span></li>
        </ul>
      </div>
      <div className="ascend-div">
        <button className={`ascend-button ${collectionPercentage === 100 ? "" : "button-disabled"}`} onClick={() => ascend()} >ASCEND</button>
        <button className="information-button" onClick={() => setShowInformation(true)} >INFORMATION</button>
      </div>
    </div>
  )
}

function ShowCardsObtained({ openingPack, closeOpeningPack, tiers, cardsObtained, cardsObtainedIndex, setCardsObtainedIndex }) {
  const [cardsToShow, setCardsToShow] = useState(5);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 685) {
        setCardsToShow(2);
      } else {
        setCardsToShow(5);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  function nextCard() {
    setCardsObtainedIndex((prevIndex) => {
      if (prevIndex + cardsToShow >= cardsObtained.length) {
        return prevIndex;
      }
      return prevIndex + cardsToShow;
    });
  }

  function prevCard() {
    setCardsObtainedIndex((prevIndex) => {
      if (prevIndex - cardsToShow < 0) {
        return 0;
      }
      return prevIndex - cardsToShow;
    });
  }

  return (
    <div className={`cards-obtained-div ${openingPack ? "" : "hide"}`}>
      <div className="cards-obtained-items">
        {cardsObtained.length > 0 && (
          <div className="cards-obtained-carrousel">
            <button className={`carrousel-button prev-button ${cardsObtainedIndex === 0 ? "button-disabled" : ""}`} onClick={prevCard}>
              {"<"}
            </button>
            <div className="current-cards-obtained">
              {cardsObtained.slice(cardsObtainedIndex, cardsObtainedIndex + cardsToShow).map((cardId, index) => (
                <CardObtained key={cardsObtainedIndex + index} tiers={tiers} cardId={cardId} />
              ))}
            </div>
            <button className={`carrousel-button next-button ${cardsObtainedIndex + cardsToShow >= cardsObtained.length ? "button-disabled" : ""}`} onClick={nextCard}>
              {">"}
            </button>
          </div>
        )}
        <div className="close-cards-obtained-div">
          <button className="close-cards-obtained-button" onClick={() => closeOpeningPack()}>ACCEPT</button>
        </div>
      </div>
    </div>
  );
}

function CardObtained({ tiers, cardId }) {
  const tier = cardId.split("-")[0];
  const card = cardId.split("-")[1];
  const cardName = tiers[tier].cards[card].name;

  return (
    <div className={`card ${getTierColor(Number(tier))}`}>
      <div className="card-obtained-img-div">
        <img className="card-obtained-img" src={`/img/gems/${cardName}.png`} alt={`${cardName}.png`} />
      </div>
      <h2 className="card-title">{cardName}</h2>
    </div>
  );
}

function ShowLevelUp({ levelUp, setLevelUp, luckLevel }) {
  return (
    <div className={`level-up-div ${levelUp ? "" : "hide"}`}>
      <div className="level-up-items">
        <div className="level-up-message">
          <h2>Level Up Luck!!</h2>
          <p>
            <span className="level-up-number">{luckLevel}</span>
            <span className="level-up-sign">{">"}</span>
            <span className="level-up-number">{luckLevel + 1}</span>
          </p>
        </div>
        <div className="close-level-up-div">
          <button className="close-level-up-button" onClick={() => setLevelUp(false)}>ACCEPT</button>
        </div>
      </div>
    </div>
  );
}

function ShowInformation({ showInformation, setShowInformation }) {
  return (
    <div className={`information-div ${showInformation ? "" : "hide"}`}>
      <div className="information-items">
        <div className="information-message">
          <h2>Information</h2>
          <p>
            Card Realm is a collectible card game where you can get cards from different tiers: Common, Uncommon, Rare and Super Rare.
            The cards are obtained by opening packs, each pack contains a random number of cards, the number of cards is determined by the luck level and the ascension level.
            The luck level determines the probability of obtaining cards from each tier, the higher the luck level the higher the probability of obtaining cards from higher tiers.
            Once you have completed the collection you cand ascend, this will reset the luck level and the collection to 0, but increase permanently your ascension level.
          </p>
        </div>
        <div className="close-information-div">
          <button className="close-information-button" onClick={() => setShowInformation(false)}>ACCEPT</button>
        </div>
      </div>
    </div >
  );
}
