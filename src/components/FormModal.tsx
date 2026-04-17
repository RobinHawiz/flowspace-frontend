import type { PropsWithChildren } from "react";

interface ModalProps extends PropsWithChildren {
  id: string;
  onClose: () => void;
}

function FormModal({ id, children, onClose }: ModalProps) {
  return (
    <dialog
      id={id}
      className="modal"
      onKeyDown={(e) => e.key === "Escape" && onClose()}
    >
      <div className="modal-box">{children}</div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}

export default FormModal;
