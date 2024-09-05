import { useState } from 'react';
import TiersData from '../data/tiersData';

export default function App() {
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

  function openPack() {
    let randomTier = Math.floor(Math.random() * tiers.length);
    let randomCard = Math.floor(Math.random() * tiers[randomTier].cards.length);
    let choseCard = `${randomTier}-${randomCard}`;

    setCardQuantities(prev => ({
      ...prev,
      [choseCard]: prev[choseCard] + 1
    }));
  }

  return (
    <div className="app">
      <div className="title">CARD REALM</div>
      <div className="panel">
        {tiers.map((tier) => (<Tier key={tier.id} tier={tier} cardQuantities={cardQuantities} />))}
        <div className="open-packs">
          <button className="open-packs-button" onClick={openPack}>OPEN PACKS</button>
        </div>
      </div>
    </div>
  );
}

function Tier({ tier, cardQuantities }) {
  return (
    <div className="tier">
      <div className="tier-title">{tier.name}</div>
      <div className="cards">
        {tier.cards.map((card) => (<Card key={tier.id + "-" + card.id} card={card} cantity={cardQuantities[`${tier.id}-${card.id}`]} />))}
      </div>
    </div>
  );
}

function Card({ card, cantity }) {
  return (
    <>
      {cantity !== 0 ?
        <div className="card card-discovered">
          <div className="card-discovered-img-div">
            <img className="card-discovered-img" src={`/img/gems/${card.name}.png`} alt={`${card.name}.png`} />
          </div>
          <h2 className="card-title">{card.name}</h2>
        </div>
        :
        <div className="card card-not-discovered">
          <img className="card-not-discovered-img" src="/img/unknown.png" alt="Card not discovered" />
        </div>}
    </>
  );
}