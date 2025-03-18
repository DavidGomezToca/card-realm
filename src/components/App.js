import LuckData from "../data/luckData"
import TiersData from "../data/tiersData"
import { useState, useEffect } from "react"
import SocialMediaData from "../data/socialMediaData.json"

/**
 * @component App.
 * @returns {JSX.Element} - The App component.
 */
export default function App() {
  /**
   * The Luck Probabilities list.
   * @type {object}.
   */
  const luckProbabilities = LuckData.luckProbabilities

  /**
   * The tiers list.
   * @type {object}.
   */
  const tiers = TiersData.tiers

  /**
   * The cards quantities list.
   * @type {object}.
   */
  const [cardQuantities, setCardQuantities] = useState(() => {
    const initialQuantities = {}
    tiers.forEach(tier => {
      tier.cards.forEach(card => {
        initialQuantities[`${tier.id}-${card.id}`] = 0
      })
    })
    return initialQuantities
  })

  /**
   * Check if a pack is being opened.
   * @type {[boolean, function]}.
   */
  const [openingPack, setOpeningPack] = useState(false)

  /**
   * The cards obtained list.
   * @type {[object, function]}.
   */
  const [cardsObtained, setCardsObtained] = useState([])

  /**
   * The luck level.
   * @type {[number, function]}.
   */
  const [luckLevel, setLuckLevel] = useState(0)

  /**
   * The quantity of packs opened.
   * @type {[number, function]}.
   */
  const [packsOpened, setPacksOpened] = useState(0)

  /**
   * Check if the luck level must increase.
   * @type {[boolean, function]}.
   */
  const [levelUp, setLevelUp] = useState(false)

  /**
   * The percentage of the collection obtained.
   * @type {[number, function]}.
   */
  const [collectionPercentage, setCollectionPercentage] = useState(0)

  /**
   * The ascension level.
   * @type {[number, function]}.
   */
  const [ascensionLevel, setAscensionLevel] = useState(0)

  /**
   * Check if the information must be shown.
   * @type {[boolean, function]}.
   */
  const [showInformation, setShowInformation] = useState(false)

  /**
   * The index uppon wich the cards obtained are shown.
   * @type {[number, function]}.
   */
  const [cardsObtainedIndex, setCardsObtainedIndex] = useState(0)

  /**
   * Handle the opening of a pack.
   */
  function handleOpenPack() {
    setOpeningPack(true)
    // Update the number of packs opened.
    setPacksOpened(prev => prev + 1)
    // Obtain the cards.
    const cardsToObtain = luckLevel + 2 + ascensionLevel
    for (let i = 0; i < cardsToObtain; i++) {
      const randomNum = Math.random()
      let randomTier
      if (randomNum < luckProbabilities[luckLevel][0]) {
        randomTier = 0
      } else if (randomNum < luckProbabilities[luckLevel][1]) {
        randomTier = 1
      } else if (randomNum < luckProbabilities[luckLevel][2]) {
        randomTier = 2
      } else {
        randomTier = 3
      }
      let randomCard = Math.floor(Math.random() * tiers[randomTier].cards.length)
      let choseCard = `${randomTier}-${randomCard}`
      setCardsObtained(prev => [...prev, choseCard])
      setCardQuantities(prev => ({
        ...prev,
        [choseCard]: prev[choseCard] + 1
      }))
    }
  }

  /**
   * Check if the luck level must increase.
   */
  function checkLuckLevelUp() {
    let levelUp = false
    if (luckLevel < 3) {
      for (let i = 0; i < tiers[luckLevel].cards.length; i++) {
        if (cardQuantities[`${luckLevel}-${i}`] === 0) {
          levelUp = false
          break
        } else {
          levelUp = true
        }
      }
    }
    // Increase the luck level if necessary.
    if (levelUp) {
      setLuckLevel(prev => prev + 1)
      setLevelUp(true)
    }
  }

  /**
   * Handle the closing of the opening pack.
   */
  function handleCloseOpeningPack() {
    checkLuckLevelUp()
    checkCollectionPercentage()
    setOpeningPack(false)
    setCardsObtained([])
    setCardsObtainedIndex(0)
  }

  /**
   * Check the collection percentage.
   */
  function checkCollectionPercentage() {
    let cardsObtained = 0
    for (let key in cardQuantities) {
      if (cardQuantities[key] !== 0) {
        cardsObtained++
      }
    }
    setCollectionPercentage(Math.round((cardsObtained / Object.keys(cardQuantities).length) * 100))
  }

  /**
   * Handle the ascension.
   */
  function ascend() {
    // If the collection is completed, ascend.
    if (collectionPercentage === 100) {
      setAscensionLevel(prev => prev + 1)
      setLuckLevel(0)
      setCollectionPercentage(0)
      setCardQuantities(() => {
        const initialQuantities = {}
        tiers.forEach(tier => {
          tier.cards.forEach(card => {
            initialQuantities[`${tier.id}-${card.id}`] = 0
          })
        })
        return initialQuantities
      })
    }
  }

  return (
    <div className="app">
      <div className="title">CARD REALM</div>
      <Information setShowInformation={setShowInformation} className={"information-button-top"} />
      <div className="cards-collection">
        {tiers.map((tier) => (<Tier key={tier.id} tier={tier} cardQuantities={cardQuantities} />))}
        <OpenCardsPack openPack={handleOpenPack} luckLevel={luckLevel} luckProbabilities={luckProbabilities} openPacksDisabled={openingPack} collectionPercentage={collectionPercentage} packsOpened={packsOpened} ascend={ascend} ascensionLevel={ascensionLevel} showInformation={showInformation} setShowInformation={setShowInformation} />
      </div>
      <ShowCardsObtained openingPack={openingPack} closeOpeningPack={handleCloseOpeningPack} tiers={tiers} cardsObtained={cardsObtained} cardsObtainedIndex={cardsObtainedIndex} setCardsObtainedIndex={setCardsObtainedIndex} />
      <ShowLevelUp levelUp={levelUp} setLevelUp={setLevelUp} luckLevel={luckLevel} />
      <ShowInformation showInformation={showInformation} setShowInformation={setShowInformation} />
    </div>
  )
}

/**
 * @component Information.
 * @param {function} setShowInformation - Sets the showInformation.
 * @param {string} className - The className of the component.
 * @returns {JSX.Element} - The Information component.
 */
function Information({ setShowInformation, className }) {
  return (
    <div className={`information-button ${className}`} onClick={() => setShowInformation(true)}>
      <i className="fa-solid fa-info" />
    </div>
  )
}

/**
 * @component Tier.
 * @param {object} tier - The tier.
 * @param {object} cardQuantities - The Card Quantities list.
 * @returns {JSX.Element} - The Tier component.
 */
function Tier({ tier, cardQuantities }) {
  return (
    <div className="tier">
      <div className={`tier-title ${getTierColor(tier.id)}`}>{tier.name}</div>
      <div className="cards">
        {tier.cards.map((card) => (<Card key={tier.id + "-" + card.id} tier={tier.id} card={card} quantity={cardQuantities[`${tier.id}-${card.id}`]} />))}
      </div>
    </div>
  )
}

/**
 * @component Card.
 * @param {number} tier - The tier of the card.
 * @param {object} card - The Card.
 * @param {number} quantity - The quantity of the card.
 * @returns {JSX.Element} - The Card component.
 */
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
  )
}

/**
 * Get the color of the tier.
 * @param {number} tier - The tier target.
 * @returns {string} - The class name of the tier.
 */
function getTierColor(tier) {
  switch (tier) {
    case 0:
      return "tier-common"
    case 1:
      return "tier-uncommon"
    case 2:
      return "tier-rare"
    case 3:
      return "tier-super-rare"
    default:
      return ""
  }
}

/**
 * @component CardCounter.
 * @param {number} quantity - The quantity of the card.
 * @returns {JSX.Element} - The CardCouner component.
 */
function CardCounter({ quantity }) {
  return (
    <div className="card-counter">
      <div>{quantity}</div>
    </div>
  )
}

/**
 * @component OpenCardsPack.
 * @param {function} openPack - Open a pack.
 * @param {number} luckLevel - The luck level.
 * @param {object} luckProbabilities - The luck probabilities list.
 * @param {boolean} openPacksDisabled - Check if the open packs button is disabled.
 * @param {number} collectionPercentage - The percentage of the collection obtained.
 * @param {number} packsOpened - The quantity of packs opened.
 * @param {function} ascend - Ascend the player.
 * @param {number} ascensionLevel - The ascension level.
 * @param {function} setShowInformation - Sets the showInformation.
 * @returns {JSX.Element} - The Open Cards Pack component.
 */
function OpenCardsPack({ openPack, luckLevel, luckProbabilities, openPacksDisabled, collectionPercentage, packsOpened, ascend, ascensionLevel, setShowInformation }) {
  return (
    <div className="open-packs-secction">
      <div id="info" className="open-packs">
        <button className="open-packs-button" onClick={() => openPack(luckLevel)} disabled={openPacksDisabled}>OPEN PACKS</button>
        <div className="open-packs-details">
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
          <Information setShowInformation={setShowInformation} className={"information-button-bottom"} />
        </div>
      </div>
      <div className="social-media-container">
        <SocialMedia />
      </div>
    </div>
  )
}

/**
 * @component SocialMedia.
 * @returns {JSX.Element} - The Social Media component.
 */
function SocialMedia() {
  /**
   * Social Medias List.
   * @type {object}.
   */
  const socialMedias = SocialMediaData.socialMedias

  return (
    <div className="social-media-container">
      <div className="social-media">
        {socialMedias.map((socialMedia) => (
          <SocialMediaIcon key={`social-media-${socialMedia.name}`} url={socialMedia.url} icon={socialMedia.icon} />
        ))}
      </div>
    </div>
  )

  /**
   * @component Social Media Icon.
   * @param {string} url - The URL of the social media.
   * @param {string} icon - The icon of the social media.
   * @returns {JSX.Element} - The Social Media Icon component.
   */
  function SocialMediaIcon({ url, icon }) {
    return (
      <a className="icon" href={url} target="_blank" rel="noreferrer">
        <i className={icon} />
      </a>
    )
  }
}

/**
 * @component ShowCardsObtained.
 * @param {function} openingPack - Check if a pack is being opened.
 * @param {function} closeOpeningPack - Close the opening pack.
 * @param {object} tiers - The tiers list.
 * @param {object} cardsObtained - The cards obtained list.
 * @param {number} cardsObtainedIndex - The index uppon wich the cards obtained are shown.
 * @param {function} setCardsObtainedIndex - Sets the cardsObtainedIndex.
 * @returns {JSX.Element} - The Show Cards Obtained component.
 */
function ShowCardsObtained({ openingPack, closeOpeningPack, tiers, cardsObtained, cardsObtainedIndex, setCardsObtainedIndex }) {
  /**
   * The quantity of cards to show.
   * @type {number, function}.
   */
  const [cardsToShow, setCardsToShow] = useState(5)


  /**
   * @effect Resize event listener.
   */
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 685) {
        setCardsToShow(2)
      } else {
        setCardsToShow(5)
      }
    }
    window.addEventListener("resize", handleResize)
    handleResize()
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  /**
   * Go to the next page of cards.
   * @returns {number} - The next index.
   */
  function nextCard() {
    setCardsObtainedIndex((prevIndex) => {
      if (prevIndex + cardsToShow >= cardsObtained.length) {
        return prevIndex
      }
      return prevIndex + cardsToShow
    })
  }

  /**
   * Go to the previoues page of cards.
   * @returns {number} - The previous index.
   */
  function prevCard() {
    setCardsObtainedIndex((prevIndex) => {
      if (prevIndex - cardsToShow < 0) {
        return 0
      }
      return prevIndex - cardsToShow
    })
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
  )
}

/**
 * @component CardObtained.
 * @param {object} tiers - The tiers list.
 * @param {string} cardId - The id of the card.
 * @returns {JSX.Element} - The Card Obtained component.
 */
function CardObtained({ tiers, cardId }) {
  /**
   * The ID of the tier.
   * @type {string}.
   */
  const tier = cardId.split("-")[0]

  /**
   * The ID of the card.
   * @type {string}.
   */
  const card = cardId.split("-")[1]

  /**
   * The name of the card.
   * @type {string}.
   */
  const cardName = tiers[tier].cards[card].name

  return (
    <div className={`card ${getTierColor(Number(tier))}`}>
      <div className="card-obtained-img-div">
        <img className="card-obtained-img" src={`/img/gems/${cardName}.png`} alt={`${cardName}.png`} />
      </div>
      <h2 className="card-title">{cardName}</h2>
    </div>
  )
}

/**
 * @component ShowLevelUp.
 * @param {object} tiers - The tiers list.
 * @param {string} cardId - The id of the card.
 * @returns {JSX.Element} - The Show Level Up component.
 */
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
  )
}

/**
 * @component ShowInformation.
 * @param {boolean} showInformation - Check if the information must be shown.
 * @param {function} setShowInformation - Sets the showInformation.
 * @returns {JSX.Element} - The Show Information component.
 */
function ShowInformation({ showInformation, setShowInformation }) {
  return (
    <div className={`information-container-div ${showInformation ? "" : "hide"}`}>
      <div className="information-div">
        <div className="information-items">
          <div className="information-message">
            <h2>Information</h2>
            <p>
              Card Realm is a collectible card game where you can get cards from different tiers: Common, Uncommon, Rare and Super Rare.<br /><br />
              The cards are obtained by opening packs, each pack contains a random number of cards, the number of cards is determined by the luck level and the ascension level.<br /><br />
              The luck level determines the probability of obtaining cards from each tier, the higher the luck level the higher the probability of obtaining cards from higher tiers.<br /><br />
              Once you have completed the collection you cand ascend, this will reset the luck level and the collection to 0, but increase permanently your ascension level.
            </p>
          </div>
          <div className="close-information-div">
            <button className="close-information-button" onClick={() => setShowInformation(false)}>ACCEPT</button>
          </div>
        </div>
      </div>
    </div>
  )
}