import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePortalIdentity, type InitiationChoice, type PortalProfile, suggestInitiatoryName } from '../portalIdentity';

type OfficerScene = {
  id: string;
  title: string;
  prompt: string;
  choices: {
    id: string;
    label: string;
    detail: string;
  }[];
};

const OFFICER_SCENES: OfficerScene[] = [
  {
    id: 'hierophant',
    title: 'The Hierophant',
    prompt: 'What should the name do when the lodge first hears it?',
    choices: [
      { id: 'reveal', label: 'Reveal the Work', detail: 'The name should sound like a vow and announce a purpose.' },
      { id: 'conceal', label: 'Veil the Person', detail: 'The name should hide the ordinary self and feel harder to pin down.' },
      { id: 'consecrate', label: 'Consecrate the Current', detail: 'The name should read like a ritual seal rather than a private nickname.' },
    ],
  },
  {
    id: 'hiereus',
    title: 'The Hiereus',
    prompt: 'Should the name lean toward a number, a title-fragment, or a virtue current?',
    choices: [
      { id: '93', label: '93', detail: 'The Will-and-Love formula gives the name a direct Thelemic code.' },
      { id: '111', label: '111', detail: 'A title-fragment feel that points toward the Aleph current and the magical son trope.' },
      { id: '777', label: '777', detail: 'A correspondences-heavy choice for a name that wants to feel like a filing key.' },
    ],
  },
  {
    id: 'hegemon',
    title: 'The Hegemon',
    prompt: 'What sort of sky should stand behind it?',
    choices: [
      { id: 'solar', label: 'Solar', detail: 'Bright, declarative, and a little imperial.' },
      { id: 'lunar', label: 'Lunar', detail: 'Reflective, hidden, and more nocturnal in tone.' },
      { id: 'stellar', label: 'Stellar', detail: 'Remote, initiatory, and aligned with the starry current.' },
    ],
  },
  {
    id: 'kerux',
    title: 'The Kerux',
    prompt: 'What should the name carry into the record book?',
    choices: [
      { id: 'adept', label: 'Adept', detail: 'Keep it formal and order-like.' },
      { id: 'oracle', label: 'Oracle', detail: 'Let the name sound prophetic and slightly uncanny.' },
      { id: 'scribe', label: 'Scribe', detail: 'Make it sound like a witness who keeps the record.' },
    ],
  },
];

const makeChoiceRecord = (officer: OfficerScene, choice: OfficerScene['choices'][number]): InitiationChoice => ({
  officerId: officer.id,
  officerName: officer.title,
  prompt: officer.prompt,
  choiceLabel: choice.label,
  choiceDetail: choice.detail,
});

const Initiation = () => {
  const navigate = useNavigate();
  const { profile, saveProfile, recordSignal, clearProfile } = usePortalIdentity();

  const [mundaneName, setMundaneName] = useState(profile?.mundaneName ?? '');
  const [step, setStep] = useState(profile ? OFFICER_SCENES.length : 0);
  const [choiceHistory, setChoiceHistory] = useState<InitiationChoice[]>(profile?.choices ?? []);
  const [drafts, setDrafts] = useState<Record<string, string>>({
    purpose: choiceHistory.find(item => item.officerId === 'hierophant')?.choiceLabel.toLowerCase() || 'reveal',
    number: choiceHistory.find(item => item.officerId === 'hiereus')?.choiceLabel.toLowerCase() || '93',
    current: choiceHistory.find(item => item.officerId === 'hegemon')?.choiceLabel.toLowerCase() || 'solar',
    tone: choiceHistory.find(item => item.officerId === 'kerux')?.choiceLabel.toLowerCase() || 'adept',
  });

  const draftName = useMemo(() => {
    const suggestion = suggestInitiatoryName({
      mundaneName,
      purpose: drafts.purpose || 'reveal',
      current: drafts.current || 'solar',
      key: drafts.number || '93',
      tone: drafts.tone || 'adept',
    });
    return suggestion;
  }, [drafts.current, drafts.number, drafts.purpose, drafts.tone, mundaneName]);

  const complete = step >= OFFICER_SCENES.length;

  function choose(officer: OfficerScene, choice: OfficerScene['choices'][number]) {
    const record = makeChoiceRecord(officer, choice);
    setChoiceHistory(prev => [...prev, record]);
    setDrafts(prev => {
      const next = { ...prev };
      if (officer.id === 'hierophant') next.purpose = choice.id;
      if (officer.id === 'hiereus') next.number = choice.id;
      if (officer.id === 'hegemon') next.current = choice.id;
      if (officer.id === 'kerux') next.tone = choice.id;
      return next;
    });
    recordSignal({
      kind: 'choice',
      label: `${officer.title}: ${choice.label}`,
      route: '/initiation',
      source: officer.title,
      detail: choice.detail,
      domain: 'initiation',
      treeNumber: 2,
      treeKind: 'route',
    });
    setStep(prev => Math.min(prev + 1, OFFICER_SCENES.length));
  }

  function finishInitiation() {
    const suggestion = suggestInitiatoryName({
      mundaneName,
      purpose: drafts.purpose || 'reveal',
      current: drafts.current || 'solar',
      key: drafts.number || '93',
      tone: drafts.tone || 'adept',
    });
    const nextProfile: PortalProfile = {
      mundaneName: mundaneName.trim() || 'Anonymous Aspirant',
      initiatoryName: draftName.initiatoryName,
      magicalMotto: draftName.magicalMotto,
      currentTitle: `${drafts.tone || 'adept'} current`,
      lineage: suggestion.lineage,
      style: suggestion.style,
      createdAt: new Date().toISOString(),
      choices: choiceHistory,
    };
    saveProfile(nextProfile);
    navigate('/character');
  }

  function resetInitiation() {
    clearProfile();
    setStep(0);
    setChoiceHistory([]);
    setDrafts({ purpose: 'reveal', number: 'number', current: 'solar', tone: 'adept' });
  }

  return (
    <div className="page-shell initiation-page">
      <section className="glass-panel page-hero initiation-page__hero">
        <div>
          <p className="page-kicker">Temple entry</p>
          <h1>Create an Initiatory Name</h1>
          <p className="page-intro">
            This is the lodge-side conversation: a scripted interview with Golden Dawn officers about what a magical
            name should do, how it should sound, and what kind of current it should carry.
          </p>
        </div>
        <div className="page-stat">
          <span>Step</span>
          <strong>{complete ? 'Complete' : `${Math.min(step + 1, OFFICER_SCENES.length)}/${OFFICER_SCENES.length}`}</strong>
        </div>
      </section>

      <section className="glass-panel initiation-panel">
        <div className="initiation-panel__intro">
          <label className="stacked-field">
            <span>Mundane name</span>
            <input
              value={mundaneName}
              onChange={event => setMundaneName(event.target.value)}
              placeholder="Enter your everyday name"
              data-portal-track-click="true"
              data-portal-track-hover="true"
              data-portal-track-label="Mundane name field"
              data-portal-track-source="Initiation"
              data-portal-track-domain="initiation"
            />
          </label>
          <p className="page-intro">
            The officers are not trying to invent a random alias. They are trying to make you choose a name with
            convention, shape, and symbolic pressure behind it.
          </p>
        </div>

        <div className="initiation-dialogue">
          {OFFICER_SCENES.slice(0, step + 1).map((scene, index) => (
            <article key={scene.id} className="glass-panel initiation-scene" data-portal-track-hover="true" data-portal-track-label={scene.title} data-portal-track-source="Initiation scene" data-portal-track-domain="initiation">
              <div className="initiation-scene__head">
                <span className="tree-chip is-active">{scene.title}</span>
                <span className="initiation-scene__count">Step {index + 1}</span>
              </div>
              <p className="initiation-scene__prompt">{scene.prompt}</p>
              <div className="initiation-scene__choices">
                {scene.choices.map(choice => {
                  const active = choiceHistory[index]?.choiceLabel === choice.label;
                  return (
                    <button
                      key={choice.id}
                      type="button"
                      className={`initiation-choice ${active ? 'is-active' : ''}`}
                      onClick={() => choose(scene, choice)}
                      data-portal-track-click="true"
                      data-portal-track-hover="true"
                      data-portal-track-label={`${scene.title}: ${choice.label}`}
                      data-portal-track-detail={choice.detail}
                      data-portal-track-source={scene.title}
                      data-portal-track-domain="initiation"
                    >
                      <strong>{choice.label}</strong>
                      <span>{choice.detail}</span>
                    </button>
                  );
                })}
              </div>
            </article>
          ))}
        </div>

        <div className="initiation-summary">
          <article className="glass-panel initiation-summary__card">
            <h2>Suggested initiatory name</h2>
            <p className="initiation-summary__name">{draftName.initiatoryName}</p>
            <p className="initiation-summary__motto">{draftName.magicalMotto}</p>
            <p className="page-intro">
              If you like the suggestion, keep it. If you want to tune it, the lodge will accept your own revised
              wording before the profile is sealed.
            </p>
          </article>

          <article className="glass-panel initiation-summary__card">
            <h2>Choice register</h2>
            <div className="initiation-choice-log">
              {choiceHistory.length ? (
                choiceHistory.map(choice => (
                  <div key={`${choice.officerId}-${choice.choiceLabel}`} className="initiation-choice-log__row">
                    <strong>{choice.officerName}</strong>
                    <span>{choice.choiceLabel}</span>
                  </div>
                ))
              ) : (
                <p className="page-intro">Choose the first answer to begin the dialogue.</p>
              )}
            </div>
          </article>
        </div>

        <div className="initiation-actions">
          <button type="button" className="tree-chip is-active" onClick={resetInitiation}>
            Reset lodge entry
          </button>
          <button
            type="button"
            className="tree-chip is-active"
            onClick={finishInitiation}
            disabled={!mundaneName.trim() || !complete}
          >
            Seal initiatory name
          </button>
        </div>
      </section>
    </div>
  );
};

export default Initiation;
