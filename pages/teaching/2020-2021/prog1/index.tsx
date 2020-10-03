/* eslint-disable @typescript-eslint/no-var-requires */
import { InferGetStaticPropsType } from 'next';
import { NextSeo } from 'next-seo';
import React, { useEffect } from 'react';

import { HomeworkCard } from '../../../../src/teaching/components/cards/HomeworkCard';
import { LectureCard } from '../../../../src/teaching/components/cards/LectureCard';
import { Header, HeaderBackgroundImage } from '../../../../src/teaching/components/Header';
import { Link, Paragraph, Section } from '../../../../src/teaching/components/Text';
import { getAllHomeworks, getAllLectures } from '../../../../src/teaching/content-io';
import { Homework, HomeworkMeta } from '../../../../src/teaching/Homework';
import { Stack } from '../../../../src/teaching/Layout';
import { Lecture, LectureMeta } from '../../../../src/teaching/Lecture';
import { comparator } from '../../../../src/teaching/Utils';

const BG_PATH = '/pyret.webp';

export const getStaticProps = async () => {
  const lecturePaths = await getAllLectures('prog1');
  const homeworkPaths = await getAllHomeworks('prog1');

  const promiseHws = homeworkPaths
    .map(async (hid) => {
      const module = await import(
        `../../../../posts/teaching/2020-2021/prog1/homeworks/${hid}.mdx`
      );
      const homework: HomeworkMeta = module.metadata;

      return {
        ...homework,
        id: parseInt(hid),
      };
    })
    .sort(comparator(async (hw) => (await hw).id));

  const homeworks: Homework[] = await Promise.all(promiseHws);

  const lectures: Lecture[] = lecturePaths
    .map((idStr) => {
      const id = parseInt(idStr);
      const lecture: LectureMeta = require(`../../../../posts/teaching/2020-2021/prog1/lectures/${id}.mdx`)
        .metadata;
      return {
        ...lecture,
        id,
        homeworks: homeworks.filter((hw) => hw.lectures.includes(id)),
      };
    })
    .sort(comparator((l) => l.id));

  return {
    props: {
      lectures,
      homeworks,
    },
  };
};

export default function ProgrammingI({
  lectures,
  homeworks,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  useEffect(() => {
    document.documentElement.lang = 'cs';
  });

  return (
    <div className="bg-white min-h-screen pb-10">
      <NextSeo
        title="Programování I"
        description="Zde naleznete seznam přednášek a úkolů zadaných v Programování I"
        openGraph={{
          title: 'Programování I',
          description: 'Zde naleznete seznam přednášek a úkolů zadaných v Programování I',
          type: 'website',
          locale: 'cs_CZ',
          images: [
            {
              url: 'https://www.evzen.dev/prog1-og-header.png',
              width: 1200,
              height: 630,
              alt: 'evzen.dev / Programování I',
            },
          ],
        }}
      />
      <HeaderBackgroundImage imagePath={BG_PATH} />
      <main className="max-w-2xl w-full px-6 mx-auto">
        <Header
          title="Programování I"
          imagePath={BG_PATH}
          homeworks={homeworks}
          nextLectureDate={new Date(2020, 9 - 1, 29)}
          lastChanged={new Date()}
        />

        <ClassInfo />
        <Resources />
        <HomeworkList homeworks={homeworks.sort(comparator((hw) => -hw.due))} />
        <LectureList lectures={lectures.sort(comparator((l) => -l.timestamp))} />
      </main>
    </div>
  );
}

function ClassInfo() {
  return (
    <Section title="Informace o předmětu">
      <Stack gap="gap-4">
        <Paragraph>
          Během roku budou průběžně zadávány domácí úkoly, každý z nich ohodnocený nějakým počtem
          bodů. Za obě pololetí bude vypsáno tolik domácích úkolů, aby za ně celkem bylo možno
          získat alespoň 150 bodů.
        </Paragraph>

        <Paragraph>
          Aby mohl být žák hodnocen, musí v obou pololetích získat za domácí úkoly alespoň 100 bodů.
          Každý žák navíc bude minimálně jednou v každém pololetí prezentovat své řešení domácího
          úkolu před třídou. Rozhodujícím faktorem při hodnocení žáka bude závěrečná zkouška
          skládající se z ústní a písemné části.
        </Paragraph>

        <Paragraph>
          Obě části závěrečné zkoušky jsou hodnoceny zvlášť, písemná s váhou 7 a ústní s váhou 10.
          Prezentace jsou hodnoceny s váhou 5. Žáci mohou navíc dostávat známky za práci v hodině.
        </Paragraph>

        <h3 className="font-bold mt-4">Podoba zkoušky</h3>

        <Paragraph>
          Zkouška se skládá z písemné a ústní části. Na začátku písemné části je zadána jedna úloha,
          na jejíž naprogramování studenti mají 90 minut. Ústní část se skládá z diskuze o
          studentově řešení písemné části a z několika otázek na teorii probranou v hodinách.
        </Paragraph>
      </Stack>
    </Section>
  );
}

function Resources() {
  return (
    <Section title="Co dělat, když něčemu nerozumím?">
      <Stack gap="gap-4">
        <Paragraph>
          Co dělat, pokud máte pocit, že si tak docela nejste jistí tím, co děláte?
        </Paragraph>

        <Paragraph>
          Především pamatujte na to, že programování je iterativní a proces plný experimentování.
          Napsat program, který bude funkční už napoprvé, je malý zázrak — hlavní je dělat malé
          krůčky, které zhruba směřují ke správnému řešení. Dělat chyby je vlastně skoro dobře,
          protože těmi se toho nejví naučíte.
        </Paragraph>

        <h3 className="font-bold mt-4">Koho se zeptat?</h3>

        <Paragraph>
          Nejjednodušší je zeptat se některého ze svých spolužáků — buďto vám poradí, nebo alespoň
          zjistíte, že nejste jediní, kdo se ztrácí. Obojí každopádně je fajn.
        </Paragraph>

        <Paragraph>
          Taková základní záložní možnost je zeptat se mě. Oceňuji všechny otázky, a nikomu žádnou
          otázku nevyčítám — i kdybyste se až teď osmělili zeptat na něco, co se dělalo pět
          přednášek zpátky.
        </Paragraph>

        <h3 className="font-bold mt-4">Zdroje na internetu</h3>

        <Paragraph>
          S obecnějšími otázkami vám pomohou lidé z{' '}
          <Link to="https://papl.cs.brown.edu/2020/">r/learnprogramming</Link> nebo na{' '}
          <Link to="https://stackoverflow.com">Stack Overflow</Link>. Zvláště druhá zmíněná stránka
          je takový zlatý grýl programátorů, a to i těch profesionálních.
        </Paragraph>

        <Paragraph>
          Pokud vám ani na jednom z míst nebudou schopni pomoci, doporučuji napsat na{' '}
          <Link to="https://groups.google.com/forum/#!forum/pyret-discuss">
            Pyret-Discuss mailing list
          </Link>
          . Na otázky a nápady tam mimo jiné často reagují také přímo autoři Pyretu, takže je to asi
          nejlepší Pyretovské místo na internetu.
        </Paragraph>
      </Stack>
    </Section>
  );
}

function HomeworkList({ homeworks }: { homeworks: Homework[] }) {
  return (
    <Section title="Zadání úkolů">
      <Paragraph className="mb-4">
        Všechny úkoly prosím posílejte nejpozději o půlnoci, a to přes messenger nebo přes mail.
        Nebude-li řečeno jinak, posílejte úkoly v souboru s názvem
        <code className="text-sm bg-green-100 px-1 rounded-sm">idUkolu_prijmeni.arr</code>,
        například <code className="text-sm bg-green-100 px-1 rounded-sm">u1_wybitul.arr</code>.
        Pokud je v rámci jednoho úkolů několik podůkolů, uložte je všechny do jednoho souboru a
        oddělte je prázdným řádkem.
      </Paragraph>
      <div className="column">
        {homeworks.map((hw) => (
          <HomeworkCard key={hw.id} homework={hw} />
        ))}
      </div>
      <style jsx>{`
        .column {
          width: 100%;
        }
      `}</style>
    </Section>
  );
}

function LectureList({ lectures }: { lectures: Lecture[] }) {
  return (
    <Section title="Zápisky z přednášek">
      <Paragraph className="mb-4">
        V ústní části zkoušky budou vyžadovány pouze znalosti, které jsou zaznamenány v těchto
        zápiscích. Přednášky jsou inspirovány knihou{' '}
        <Link to="https://papl.cs.brown.edu/2020/">
          Programming and Programming Languages (PAPL)
        </Link>
        , pokud vám tedy něco z přednášek nebude jasné, můžete se zkusit podívat i do ní.
      </Paragraph>
      <div className="column">
        {lectures.map((l) => (
          <LectureCard key={l.id} lecture={l} />
        ))}
      </div>
      <style jsx>{`
        .column {
          width: 100%;
        }
      `}</style>
    </Section>
  );
}
