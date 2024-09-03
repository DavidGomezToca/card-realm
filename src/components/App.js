function App() {
  return (
    <div className="app">
      <div className="title">CARD REALM</div>
      <div className="collection">
        <Tier tier="COMMON" cardsNumber={6} />
        <Tier tier="UNCOMMON" cardsNumber={5} />
        <Tier tier="RARE" cardsNumber={4} />
        <Tier tier="SUPER RARE" cardsNumber={3} />
      </div>
    </div>
  );
}

function Tier({ tier, cardsNumber }) {
  return (
    <div className="tier">
      <div className="tier-title">{tier}</div>
      <div className="cards">
        {Array(cardsNumber).fill(<Card />)}
      </div>
    </div>
  );
}

function Card() {
  return (
    <div className="card">
      <h2 className="card-title">Card Title</h2>
      <p className="card-description">Card Description</p>
    </div>
  );
}

export default App;