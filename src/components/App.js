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

  function handleOpenPack(luckLevel) {
    for (let i = 0; i < luckLevel + 1; i++) {
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
      setCardQuantities(prev => ({
        ...prev,
        [choseCard]: prev[choseCard] + 1
      }));
    }
  }

  return (
    <div className="app">
      <div className="title">CARD REALM</div>
      <div className="panel">
        {tiers.map((tier) => (<Tier key={tier.id} tier={tier} cardQuantities={cardQuantities} />))}
        <ButtonCardsPack openPack={handleOpenPack} />
      </div>
    </div>
  );
}

function ButtonCardsPack({ openPack }) {
  // TODO: Delete comment
  // eslint-disable-next-line no-unused-vars
  const [luckLevel, setLuckLevel] = useState(0);

  return (
    <div className="open-packs">
      <button className="open-packs-button" onClick={() => openPack(luckLevel)}>OPEN PACKS</button>
    </div>
  )
}

function Tier({ tier, cardQuantities }) {
  return (
    <div className="tier">
      <div className="tier-title">{tier.name}</div>
      <div className="cards">
        {tier.cards.map((card) => (<Card key={tier.id + "-" + card.id} card={card} quantity={cardQuantities[`${tier.id}-${card.id}`]} />))}
      </div>
    </div>
  );
}

function Card({ card, quantity }) {
  return (
    <>
      {quantity !== 0 ?
        <div>
          <div className="card card-discovered">
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

function CardCounter({ quantity }) {
  return (
    <div className="card-counter">
      <div>{quantity}</div>
    </div>
  )
}