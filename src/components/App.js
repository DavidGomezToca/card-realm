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
        {tier.cards.map((card) => (<Card key={tier.id + "-" + card.id} card={card} />))}
      </div>
    </div>
  );
}

function Card({ card }) {
  // eslint-disable-next-line no-unused-vars
  const [cantity, setCantity] = useState(0);
  // TODO: Remove the comment
  // console.log(card.name);
  // if (card.name === "Card C1" && cantity === 0) {
  //   setCantity(1);
  // }

  return (
    <>
      {cantity !== 0 ?
        <div className="card card-discovered"><h2 className="card-title">{card.name}</h2></div>
        :
        <div className="card card-not-discovered"><img className="card-not-discovered-img" src="/img/unknown.png" alt="Card not discovered" /></div>}
    </>
  );
}