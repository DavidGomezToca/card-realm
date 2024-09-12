import { useState } from 'react';
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
  }

  function checkCollectionPercentage() {
    let cardsObtained = 0;
    for (let key in cardQuantities) {
      console.log(key);
      console.log(cardQuantities[key]);
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
        <OpenCardsPack openPack={handleOpenPack} luckLevel={luckLevel} luckProbabilities={luckProbabilites} openPacksDisabled={openingPack} collectionPercentage={collectionPercentage} packsOpened={packsOpened} ascend={ascend} ascensionLevel={ascensionLevel} />
      </div>
      <ShowCardsObtained openingPack={openingPack} closeOpeningPack={handleCloseOpeningPack} tiers={tiers} cardsObtained={cardsObtained} />
      <ShowLevelUp levelUp={levelUp} setLevelUp={setLevelUp} luckLevel={luckLevel} />
    </div>
  );
}

function Tier({ tier, cardQuantities }) {
  return (
    <div className="tier">
      <div className="tier-title">{tier.name}</div>
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

function OpenCardsPack({ openPack, luckLevel, luckProbabilities, openPacksDisabled, collectionPercentage, packsOpened, ascend, ascensionLevel }) {
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
      <div className="reset-collection-div">
        <button className={`reset-collection-button ${collectionPercentage === 100 ? "" : "button-disabled"}`} onClick={() => ascend()} >ASCEND</button>
      </div>
    </div>
  )
}

function ShowCardsObtained({ openingPack, closeOpeningPack, tiers, cardsObtained }) {
  return (
    <div className={`cards-obtained-div ${openingPack ? "" : "hide"}`}>
      <div className="cards-obtained-items">
        <div className="current-cards-obtained">
          {cardsObtained.map((card, index) => (<CardObtained key={"NC-" + index} tiers={tiers} cardId={card} />))}
        </div>
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
