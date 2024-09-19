import React from "react";
import { useSelector } from "react-redux";
import Header from "./components/agent/base/Header";
import Footer from "./components/agent/base/Footer";
import { useTranslation } from "react-i18next";

export default function Terms() {
    // const dispatch = useDispatch();
    const language = useSelector((state) => state.auth.language);
    const [t, i18n] = useTranslation("global");

    return (
        <div>
            <Header />
            <main className="mt-20" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                <div className="container mx-auto p-10 pt-5 ">
                    <div>
                        <h1 className="text-text_steel_blue font-bold text-center text-4xl">{t("term.term_condition_text")}</h1>
                        <h2 className="font-bold mt-3 text-lg">{t("term.intro_text")}:</h2>
                        <p className="mt-2">
                            {t("term.first_welcome_text")}
                        </p>
                        {/* <p className="mt-3">
                            Eget quis mi enim, leo lacinia pharetra, semper. Eget in volutpat mollis at volutpat lectus velit, sed auctor. Porttitor fames arcu quis fusce augue enim. Quis at habitant diam at. Suscipit tristique risus, at donec. In turpis vel et quam imperdiet. Ipsum molestie aliquet sodales id est ac volutpat.
                        </p> */}
                        <h2 className="font-bold mt-3 text-lg">
                            {t("term.accept_text")}:
                        </h2>
                        <p className="mt-3">
                            {t("term.second_your_text")}
                        </p>
                        {/* <p className="mt-4 border-l-2 border-background_steel_blue pl-2">
                            "Ipsum sit mattis nulla quam nulla. Gravida id gravida ac enim mauris id. Non pellentesque congue eget consectetur turpis. Sapien, dictum molestie sem tempor. Diam elit, orci, tincidunt aenean tempus."
                        </p> */}
                        <h2 className="font-bold mt-3 text-xl">
                            {t("term.condition_text")}:
                        </h2>

                        <h2 className="font-bold mt-3 text-lg">
                            {t("term.account_text")}:
                        </h2>
                        <p className="mt-3">
                            {t("term.third_must_text")}
                        </p>

                        <h2 className="font-bold mt-3 text-lg">
                            {t("term.booking_text")}:
                        </h2>
                        <p className="mt-3">
                            {t("term.booking_p1_text")}
                        </p>
                        <p className="mt-3">
                            {t("term.booking_p2_text")}
                        </p>
                        <p className="mt-3">
                            {t("term.booking_p3_text")}
                        </p>

                        <h2 className="font-bold mt-3 text-lg">
                            {t("term.liability_text")}:
                        </h2>
                        <p className="mt-3">
                            {t("term.liability_p1_text")}
                        </p>
                        <p className="mt-3">
                            {t("term.liability_p2_text")}
                        </p>

                        <h2 className="font-bold mt-3 text-lg">
                            {t("term.modification_text")}:
                        </h2>
                        <p className="mt-3">
                            {t("term.modification_p_text")}
                        </p>

                        <h2 className="font-bold mt-3 text-lg">
                            {t("term.jurisdiction_text")}:
                        </h2>
                        <p className="mt-3">
                            {t("term.jurisdiction_p_text")}
                        </p>

                        <h2 className="font-bold mt-3 text-lg">
                            {t("term.note_text")}:
                        </h2>
                        <p className="mt-3">
                            {t("term.note_p1_text")}
                        </p>
                        <p className="mt-3">
                            {t("term.note_p2_text")}
                        </p>
                        <p className="mt-3">
                            {t("term.note_p3_text")}
                        </p>
                    </div>

                    {/* <div>
                        <h2 className="font-bold mt-5 text-xl">Conclusion</h2>
                        <p className="mt-4">
                            Morbi sed imperdiet in ipsum, adipiscing elit dui lectus. Tellus id scelerisque est ultricies ultricies. Duis est sit sed leo nisl, blandit elit sagittis. Quisque tristique consequat quam sed. Nisl at scelerisque amet nulla purus habitasse.
                        </p>
                        <p className="mt-3">
                            Nunc sed faucibus bibendum feugiat sed interdum. Ipsum egestas condimentum mi massa. In tincidunt pharetra consectetur sed duis facilisis metus. Etiam egestas in nec sed et. Quis lobortis at sit dictum eget nibh tortor commodo cursus.
                        </p>
                        <p className="mt-3">
                            Odio felis sagittis, morbi feugiat tortor vitae feugiat fusce aliquet. Nam elementum urna nisi aliquet erat dolor enim. Ornare id morbi eget ipsum. Aliquam senectus neque ut id eget consectetur dictum. Donec posuere pharetra odio consequat scelerisque et, nunc tortor. Nulla adipiscing erat a erat. Condimentum lorem posuere gravida enim posuere cursus diam.
                        </p>
                    </div> */}
                </div>
            </main>
            <Footer />
        </div>
    );
}
