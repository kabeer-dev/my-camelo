import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Header from "./components/base/Header";
import Footer from "./components/base/Footer";
import { useTranslation } from "react-i18next";

export default function Terms() {
    const dispatch = useDispatch();
    const language = useSelector((state) => state.auth.language);
    const [t, i18n] = useTranslation("global");

    return (
        <div>
            <Header />
            <main className="mt-20" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                <div className="container mx-auto p-10 pt-5 ">
                    <div>
                        <h1 className="text-text_steel_blue font-bold text-center text-4xl">Terms and Conditions</h1>
                        <h2 className="font-bold mt-3 text-xl">Introduction</h2>
                        <p className="mt-2">
                            Mi tincidunt elit, id quisque ligula ac diam, amet. Vel etiam suspendisse morbi eleifend faucibus eget vestibulum felis. Dictum quis montes, sit sit. Tellus aliquam enim urna, etiam. Mauris posuere vulputate arcu amet, vitae nisi, tellus tincidunt. At feugiat sapien varius id.
                        </p>
                        <p className="mt-3">
                            Eget quis mi enim, leo lacinia pharetra, semper. Eget in volutpat mollis at volutpat lectus velit, sed auctor. Porttitor fames arcu quis fusce augue enim. Quis at habitant diam at. Suscipit tristique risus, at donec. In turpis vel et quam imperdiet. Ipsum molestie aliquet sodales id est ac volutpat.
                        </p>
                        <h2 className="font-bold mt-3">
                            Dolor enim eu tortor urna sed duis nulla. Aliquam vestibulum, nulla odio nisl vitae. In aliquet pellentesque aenean hac vestibulum turpis mi bibendum diam. Tempor integer aliquam in vitae malesuada fringilla.
                        </h2>
                        <p className="mt-3">
                            Elit nisi in eleifend sed nisi. Pulvinar at orci, proin imperdiet commodo consectetur convallis risus. Sed condimentum enim dignissim adipiscing faucibus consequat, urna. Viverra purus et erat auctor aliquam. Risus, volutpat vulputate posuere purus sit congue convallis aliquet. Arcu id augue ut feugiat donec porttitor neque. Mauris, neque ultricies eu vestibulum, bibendum quam lorem id. Dolor lacus, eget nunc lectus in tellus, pharetra, porttitor.
                        </p>
                        <p className="mt-4 border-l-2 border-background_steel_blue pl-2">
                            "Ipsum sit mattis nulla quam nulla. Gravida id gravida ac enim mauris id. Non pellentesque congue eget consectetur turpis. Sapien, dictum molestie sem tempor. Diam elit, orci, tincidunt aenean tempus."
                        </p>
                        <p className="mt-4">
                            Tristique odio senectus nam posuere ornare leo metus, ultricies. Blandit duis ultricies vulputate morbi feugiat cras placerat elit. Aliquam tellus lorem sed ac. Montes, sed mattis pellentesque suscipit accumsan. Cursus viverra aenean magna risus elementum faucibus molestie pellentesque. Arcu ultricies sed mauris vestibulum.
                        </p>
                    </div>

                    <div>
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
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
