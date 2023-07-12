import React from "react";
import { CgClose } from "react-icons/cg";

const ModalBox = ({ isModalOpen, setIsModalOpen, children }) => {
  if (isModalOpen === true) {
    return (
      <div>
        <div className="fixed inset-0 z-10 mx-5 overflow-auto md:mx-0">
          <div className="flex min-h-screen items-center justify-center">
            <div
              onClick={() => setIsModalOpen(!isModalOpen)}
              className="fixed inset-0 bg-gray-500 bg-opacity-10 transition-opacity"
              aria-hidden="true"
            ></div>
            <div className="relative flex h-full w-full transform flex-wrap overflow-hidden rounded-[20px] bg-white shadow-xl transition-all sm:w-fit">
              <CgClose
                onClick={() => setIsModalOpen(!isModalOpen)}
                className="absolute right-3 top-3 cursor-pointer text-2xl hover:text-blue-500"
              />
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default ModalBox;
