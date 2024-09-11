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

  function handleOpenPack() {
    setOpeningPack(true);
    setPacksOpened(prev => prev + 1);
    for (let i = 0; i < luckLevel + 2; i++) {
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
    }
  }

  function handleCloseOpeningPack() {
    checkLuckLevelUp();
    setOpeningPack(false);
    setCardsObtained([]);
  }

  return (
    <div className="app">
      <div className="title">CARD REALM</div>
      <div className="cards-collection">
        {tiers.map((tier) => (<Tier key={tier.id} tier={tier} cardQuantities={cardQuantities} />))}
        <OpenCardsPack openPack={handleOpenPack} luckLevel={luckLevel} luckProbabilities={luckProbabilites} disabled={openingPack} packsOpened={packsOpened} />
      </div>
      <ShowCardsObtained openingPack={openingPack} closeOpeningPack={handleCloseOpeningPack} tiers={tiers} cardsObtained={cardsObtained} />
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

function OpenCardsPack({ openPack, luckLevel, luckProbabilities, disabled, packsOpened }) {
  return (
    <div className="open-packs">
      <button className="open-packs-button" onClick={() => openPack(luckLevel)} disabled={disabled}>OPEN PACKS</button>
      <div className='open-packs-details'>
        <ul>
          <li>Luck Level: <span>{luckLevel < 3 ? luckLevel + 1 : "MAX"}</span></li>
          <li>Cards obtained by pack: <span>{luckLevel + 2}</span></li>
          <li>Probability of Tier C: <span>{luckProbabilities[luckLevel][0] * 100}%</span></li>
          <li>Probability of Tier U: <span>{(luckProbabilities[luckLevel][1] * 100 - luckProbabilities[luckLevel][0] * 100)}%</span></li>
          <li>Probability of Tier R: <span>{(luckProbabilities[luckLevel][2] * 100 - luckProbabilities[luckLevel][1] * 100)}%</span></li>
          <li>Probability of Tier SR: <span>{(100 - luckProbabilities[luckLevel][2] * 100)}%</span></li>
          <li>Total open packs: <span>{packsOpened}</span></li>
        </ul>
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
