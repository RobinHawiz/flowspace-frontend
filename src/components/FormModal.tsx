import { type PropsWithChildren, type RefObject } from "react";

interface ModalProps extends PropsWithChildren {
  id?: string;
  dialogRef?: RefObject<HTMLDialogElement | null>;
  onClose: () => void;
}

function FormModal({ id, children, dialogRef, onClose }: ModalProps) {
  return (
    <dialog
      id={id}
      className="modal z-10"
      ref={dialogRef}
      onKeyDown={(e) => e.key === "Escape" && onClose?.()}
    >
      <div className="modal-box">{children}</div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}

export default FormModal;
