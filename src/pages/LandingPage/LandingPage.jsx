import React from "react";
import hero from "../../assets/heroimg.webp";
import clockImg from "../../assets/clock.png";
import freeImg from "../../assets/free.png";
import { MdOutlineManageAccounts } from "react-icons/md";

const LandingPage = () => {
  const faqs = [
    {
      question: "What is online courier & accounting software?",
      answer:
        "Online courier & accounting software is sometimes called 'cloud-based software'. It allows users to create, store and send invoices from any device. You don't need anything saved on your computer, and there are no disks to load. Simply log in on a web browser and jump right into your OrderBoi online account. Your personal data and settings are right there, stored safely in 'the cloud'.",
    },
    {
      question: "Why should my business move to the cloud?",
      answer:
        "There are multiple reasons why businesses are choosing to move to the cloud instead of using traditional methods to manage their businesses. The advantages of moving to the cloud with OrderBoi for your business include: saving time and costs by automating tasks with our invoicing, and the ability to access your business data from anywhere at anytime. You can read more about moving your business to the cloud",
    },
    {
      question: "Is my data is secure?",
      answer:
        "When you use OrderBoi Online, your data is stored on our servers in the cloud. We know that data is one of your company's most valuable assets, so we go to great lengths to protect it.",
    },
    {
      question: "Can I create user account?",
      answer:
        "Absolutely. You can create user account and give permission to handle your business from any where.",
    },
  ];

  return (
    <div className="bg-white">
      <img
        className="object-top-right h-full w-full object-contain md:h-[92vh] md:object-cover"
        src={hero}
        alt=""
      />
      <div className="container flex flex-col items-center gap-10 py-10 md:py-20">
        <div className="flex w-full flex-col items-center justify-between gap-5 rounded-lg bg-[#0D333F] p-5 text-white md:mb-20 md:h-[238px] md:flex-row md:gap-0 md:px-[54px]">
          <div className="space-y-4 md:space-y-0">
            <p className="text-center text-3xl font-semibold text-[#0FD46C] md:text-start md:text-5xl md:font-bold">
              Learn what OrderBoi can do for you.
            </p>
            <p className="text-center md:text-start md:text-[22px]">
              Sign up for a free and learn how OrderBoi can help you see your
              business clearer
            </p>
          </div>
          <button className="btn-success btn border-none bg-[#2CA01C] text-white">
            Register For Free
          </button>
        </div>
        <div className="flex flex-col justify-center gap-20 md:h-[70vh]">
          <div className="flex flex-col items-center gap-5">
            <p className="text-center text-4xl font-bold text-[#0FD46C]">
              Powerful courier & accounting tools for <br /> small and growing
              business
            </p>
            <p className="text-center font-bold">
              Manage everything in one place. Save time & money using OrderBoi
            </p>
          </div>
          <div className="flex flex-col justify-center gap-10 md:flex-row">
            <div className="flex flex-col items-center justify-between gap-5 rounded-lg bg-[#E0EEEE] p-10">
              <img className="h-10 w-10" src={clockImg} alt="" />
              <p className="text-2xl font-bold">Hello Organized</p>

              <p className="w-52 text-center font-bold">
                OrderBoi Online keeps everything in its right place, so you'll
                always have what you need when you need it.
              </p>

              <button className="btn-success btn border-none bg-[#2CA01C] text-white">
                Register For Free
              </button>
            </div>
            <div className="flex flex-col items-center justify-between gap-5 rounded-lg bg-[#E0EEEE] p-10">
              <img className="h-10 w-10" src={freeImg} alt="" />
              <p className="text-2xl font-bold">Free up your time</p>

              <p className="w-52 text-center font-bold">
                Manage Courier in a single click, track order and print invoice,
                save your time and money.
              </p>

              <button className="btn-success btn border-none bg-[#2CA01C] text-white">
                Register For Free
              </button>
            </div>
            <div className="flex flex-col items-center justify-between gap-5 rounded-lg bg-[#E0EEEE] p-10">
              <MdOutlineManageAccounts className="text-4xl" />
              <p className="text-2xl font-bold">Manage everything</p>

              <p className="w-52 text-center font-bold">
                OrderBoi can help you to manage inventory, fraud check,
                duplicate order, print invoice, manage multiple-courier.
              </p>

              <button className="btn-success btn border-none bg-[#2CA01C] text-white">
                Register For Free
              </button>
            </div>
          </div>
        </div>

        <div className="flex h-[70vh] flex-col justify-center gap-4">
          <p className="text-center text-4xl font-bold">
            Frequently asked questions
          </p>
          {faqs.map((faq, index) => (
            <div key={index} className="join-vertical join w-full">
              <div className="collapse-arrow join-item collapse rounded-none border border-x-0 border-b-0 border-gray-200">
                <input type="radio" name="my-accordion-4" checked="checked" />
                <div className="collapse-title text-xl font-medium">
                  {faq.question}
                </div>
                <div className="collapse-content">
                  <p>{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mb-20 flex w-full flex-col items-center justify-center rounded-lg bg-[#0D333F] p-5 text-white md:h-[238px] md:px-[54px]">
          <div className="space-y-3 text-center">
            <p className="text-2xl text-white md:text-5xl">
              Please feel free to contact us for any inquiries
            </p>
            <p className="md:text-2xl">Email: support@orderboi.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
