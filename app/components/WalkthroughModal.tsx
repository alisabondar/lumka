import styles from "./WalkthrougModal.module.css";

interface WalkthroughModalProps {
  title: string;
  text: string;
  stepIndex: number;
  totalSteps: number;
  onNext: () => void;
  onBack: () => void;
  onClose: () => void;
  isLastStep: boolean;
  position?: { top?: number; bottom?: number; left?: number; right?: number } | null;
}

export const WalkthroughModal = ({
  title,
  text,
  stepIndex,
  totalSteps,
  onNext,
  onBack,
  onClose,
  isLastStep,
  position,
}: WalkthroughModalProps) => {
  const modalStyle: React.CSSProperties = position && Object.keys(position).length > 0
    ? {
        position: 'fixed',
        ...position,
        margin: 0,
      }
    : {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        margin: 0,
      };

  return (
    <>
      <div className={styles.overlay} />
      <div className={styles.modal} style={modalStyle}>
        <h2>{title}</h2>
        <p>{text}</p>

        <div className={styles.controls}>
          <button
            onClick={onBack}
            disabled={stepIndex === 0}
          >
            Back
          </button>

          {!isLastStep ? (
            <button onClick={onNext}>
              Next
            </button>
          ) : (
            <button onClick={onClose}>
              Start Game
            </button>
          )}
        </div>

        <div className={styles.progress}>
          {stepIndex + 1} / {totalSteps}
        </div>
      </div>
    </>
  );
};
