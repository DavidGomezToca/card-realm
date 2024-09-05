import { useState } from 'react';
import TiersData from '../data/tiersData';

export default function App() {
  const tiers = TiersData.tiers;

  return (
    <div className="app">
      <div className="title">CARD REALM</div>
      <div className="collection">
        {tiers.map((tier) => (<Tier key={tier.id} tier={tier} />))}
      </div>
    </div>
  );
}

function Tier({ tier }) {
  return (
    <div className="tier">
      <div className="tier-title">{tier.name}</div>
      <div className="cards">
        {tier.cards.map((card) => (<Card key={tier.id + "-" + card.id} tier={tier.name} card={card} />))}
      </div>
    </div>
  );
}

function Card({ tier, card }) {
  const [cantity, setCantity] = useState(0);

  // TODO: Implement the logic to set the cantity of the card
  if ((tier === "COMMON" || tier === "UNCOMMON") && cantity === 0) {
    setCantity(1);
  }

  return (
    <>
      {cantity !== 0 ?
        <div className="card card-discovered">
          <div className="card-discovered-img-div">
            <img className="card-discovered-img" src={`/img/gems/${card.name}.png`} alt={`${card.name}.png`} />
          </div>
          <h2 className="card-title">{card.name}</h2></div>
        :
        <div className="card card-not-discovered">
          <img className="card-not-discovered-img" src="/img/unknown.png" alt="Card not discovered" />
        </div>}
    </>
  );
}