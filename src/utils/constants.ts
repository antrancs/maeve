export enum ActivityType {
  FeelGood = '976439512',
  Workout = '976439525',
  Party = '976439514',
  Chill = '976439503',
  Romance = '976439518',
  Motivation = '1142652615',
  Sleep = '1442122106',
  Focus = '976439521',
  Sad = '976439500',
  Decade = '1142652618'
}

export const activityIds = Object.keys(ActivityType).map(
  key => ActivityType[key as any]
);

export type Genre = {
  id: string;
  name: string;
  colors?: string[];
};

export const GENRES: Genre[] = [
  {
    id: '14',
    name: 'Pop'
  },
  {
    id: '15',
    name: 'R&B/Soul'
  },
  {
    id: '17',
    name: 'Dance'
  },
  {
    id: '20',
    name: 'Alternative'
  },
  {
    id: '18',
    name: 'Hip-Hop/Rap'
  },
  {
    id: '6',
    name: 'Country'
  },
  {
    id: '21',
    name: 'Rock'
  },
  {
    id: '7',
    name: 'Electronic'
  },
  {
    id: '11',
    name: 'Jazz'
  },
  {
    id: '5',
    name: 'Classical'
  }
];

export enum RepeatMode {
  Off = 0,
  All = 1,
  One = 2
}

export enum ButtonStyle {
  normal = 'normal',
  round = 'round'
}

export enum PlaybackBitrate {
  STANDARD = 64,
  HIGH = 256
}

export const PLACEHOLDER_IMAGE =
  'https://user-images.githubusercontent.com/14043840/50736349-e11feb00-11bc-11e9-84d9-20dc9652ef5b.jpeg';

export const DAILY_TOP_100_COUNTRY_MAP: { [id: string]: string } = {
  au: 'pl.18be1cf04dfd4ffb9b6b0453e8fae8f1',
  ca: 'pl.79bac9045a2540e0b195e983df8ba569',
  dk: 'pl.d08496850bc840a4874e877177a69f9f',
  de: 'pl.c10a2c113db14685a0b09fa5834d8e8b',
  jp: 'pl.043a2c9876114d95a4659988497567be',
  es: 'pl.0d656d7feae64198bc5fb1b02786ed75',
  se: 'pl.5876877c387b4ffb8860ac3ea2c244c3',
  gb: 'pl.c2273b7e89b44121b3093f67228918e7',
  fr: 'pl.6e8cfd81d51042648fa36c9df5236b8d',
  no: 'pl.05a67957c3974729aac67c01247e55b6',
  ai: 'pl.48bbe91b5d944b0aa7b1e90a3889b6a7',
  ag: 'pl.cca0d50798424e4e871820a03719e841',
  ar: 'pl.7ae8594e422f44658e58212d876d9323',
  am: 'pl.42abb2144d594137a8fb4d37a9f35b42',
  at: 'pl.f34430d010a843128337927bba98048b',
  az: 'pl.ccc31c81303c405baddaaf0f5328b7f3',
  bh: 'pl.02a8276fa4ca40b19ac248fda4725fbb',
  bb: 'pl.13743dcd86174ea5b4cb6b2534637e23',
  by: 'pl.50c1747c37404a9aa07acc39316f6873',
  be: 'pl.cefe84f7916b4cae8b21b0a78e948380',
  bz: 'pl.c6d8b5dcf6814168a4b0262628d3a317',
  bm: 'pl.b0cc7d688aa94588a640412c9686bf1b',
  bo: 'pl.cfcd547b034d47648a16fb8e2df0623f',
  bw: 'pl.73bb3593281444fb8ab21d58ccab4600',
  br: 'pl.11ac7cc7d09741c5822e8c66e5c7edbb',
  vg: 'pl.d4b2fe66a810440186c27434fa71072a',
  bg: 'pl.040cf0b4c7e9467eb9eed2d33e7a29d6',
  kh: 'pl.9d9ee12c7734402ab5ab0dc81911822c',
  cv: 'pl.917f294713a34cdeb46e67ad2a137067',
  ky: 'pl.c5a087a907dc44dfbbbd2f471f16a467',
  cl: 'pl.81015bbbefdd46758b2c8c7065f0863e',
  cn: 'pl.fde851dc95ce4ffbb74028dfd254ced5',
  co: 'pl.d116fa6286734b74acff3d38a740fe0d',
  cr: 'pl.7771c20fc0354f64a723ae9c11a4d5f5',
  cy: 'pl.a5ae21745d1d45edacb68971746d31ae',
  cz: 'pl.e447d9ba54254130a76143bf6fdfa65c',
  dm: 'pl.68e6ad675521400487ea78463b39899d',
  do: 'pl.deec8b036583481782c40a2a05554b0b',
  ec: 'pl.41b0d399afea495699dbc7660994a96c',
  eg: 'pl.a0b3d0b9a2764646b59ccacdf82e3544',
  sv: 'pl.9a175d1e9b1e4c81bfa7c63f28c1a79e',
  ee: 'pl.054734b06c7742a985805f45a283bcb4',
  fm: 'pl.bee910bc105b43c28eed7d20e4e09a8c',
  fj: 'pl.1e2c1286034c49b78139d2b4ff499a94', // special
  fi: 'pl.acea41a017664a8ebcd5aa1622aecc88',
  gm: 'pl.62e12ecd522d47858321846adcaac43d',
  gh: 'pl.78f1974e882d4952b26ebfb8e017c933',
  gr: 'pl.0f15f3a8ba014979b9fdd7a0ef906dca',
  gd: 'pl.b14c0257c1744d2686f88d05ab1efb4c',
  gt: 'pl.7235b4236ee241f083f8026d372cc2d8',
  gw: 'pl.ac455234996b468b9f58e573752ab05c',
  hn: 'pl.ec6d493f976349dfb0cba8f6c2f7e937',
  hk: 'pl.7f35cffa10b54b91aab128ccc547f6ef', // special
  hu: 'pl.cee165c3a51e466481bde5de75d6dee3',
  in: 'pl.c0e98d2423e54c39b3df955c24df3cc5',
  id: 'pl.2b7e089dc9ef4dd7a18429df9c6e26a3',
  ie: 'pl.3b47111ed6b7461eae67fadf895d56db',
  il: 'pl.0c9765e5330048af96c2336fa7bc3525',
  it: 'pl.737e067787df485a8062e2c4927d94db',
  jo: 'pl.5adf310412994d9483918fcd8e091fc5',
  kz: 'pl.27d3c4d63b0e41f29f79c98bb5a090e1',
  ke: 'pl.0b36ea82865d4adeb9d1d62207aab172',
  kg: 'pl.5318aa72adb84bcfac803ecaf6156325',
  la: 'pl.42b3fe9c75a947ab84a80019e7bcd704',
  lv: 'pl.5ac047a9ada144aebb9b2f16f5bc8c1d',
  lb: 'pl.838a4daba8924c42969ca7162fdc74da',
  lt: 'pl.e96de57d836e42dca30f7da24c64bbea',
  lu: 'pl.2f85377267d74a13be02a53882a5b488',
  mo: 'pl.28e8a715012b4ed9b9527100da1e3474', // special
  my: 'pl.a165defeeccb4b17a59bb5c85637b9b7',
  mt: 'pl.06ab782ba2324ae49317d6bde84eef56',
  mu: 'pl.5e6efed969354b378770c2ea6f2fed6b',
  mn: 'pl.71c450d15a9e4440ac5d24c174958225',
  np: 'pl.9032e70a644e442688f120a829c636cd',
  nl: 'pl.26fb1998d54a4b3192be548529a97f8e',
  ni: 'pl.2249e0cc6edb46f4ae64de2c937a4f41',
  ng: 'pl.2fc68f6d68004ae993dadfe99de83877',
  ne: 'pl.cd4a09b0acde49cda246819d9421b26b',
  om: 'pl.d4ca5698caf04a9f873861c3659aeeca',
  pa: 'pl.9d5ee7c72f804dbab97163616c7a8399',
  pg: 'pl.30fbe54afbf846edabdbe00e90095d04',
  py: 'pl.0843e61953c1430287162e5a36dff52b',
  pe: 'pl.569a0034bcc64db68bb13afa8171a687',
  ph: 'pl.b9eb00f9d195440e8b0bdf19b8db7f34',
  pl: 'pl.8c91cbb0ef4e48308dbbba4238135eaf',
  pt: 'pl.5437c1490ac74e9e9505fc7d1f201655',
  md: 'pl.e4dcd4663130419bb03b80216dee9f57',
  ro: 'pl.0c6bea611ad54c79b854299bc515a5a6',
  ru: 'pl.728bd30a9247487c80a483f4168a9dcd',
  sa: 'pl.a5365fa3b6ec4a34994339ca100801ae',
  sg: 'pl.4d763fa1cf15433b9994a14be6a46164', // special
  sk: 'pl.2e50996a5bf44ab78cbb5c34b1992701',
  si: 'pl.e7374de32aec446c92136234d5bcae2f',
  za: 'pl.447bd05172824b89bd745628f7f54c18',
  kn: 'pl.be7b2d63abaf4d25918ef41187f88be4',
  sz: 'pl.046c3e297666475aa84c12159a954596',
  ch: 'pl.bb1f5218a0f04de3877c4f9ccd63d260',
  tw: 'pl.741ff34016704547853b953ec5181d83',
  tj: 'pl.ea75568dc0524a479b818d551a7b3c35',
  th: 'pl.c509137d97214632a087129ece060a3d',
  tt: 'pl.f1495be1a9774341ab8a1eceb7011579',
  tr: 'pl.f3e0d6ef238542609572c18b0de1513b',
  tm: 'pl.f783d8aec4df401583434a2454adbc3d',
  ug: 'pl.b9e553253ed24c2a829c9c08209e5f67',
  ua: 'pl.815f78effb3844909a8259d759ecbddb',
  ae: 'pl.7b5e51f09aee4733958e23ea97dda459',
  uz: 'pl.90ad69a600ed4d10b00d158eea68cad7',
  ve: 'pl.617da0e0bbb74461b607cad435b1e941',
  vn: 'pl.550110ec6feb4ae0aff364bcde6d1372',
  zw: 'pl.550110ec6feb4ae0aff364bcde6d1372',
  us: 'pl.606afcbb70264d2eb2b51d8dbcfa6a12',
  mx: 'pl.df3f10ca27b1479087de2cd3f9f6716b',
  kr: 'pl.d3d10c32fbc540b38e266367dc8cb00c'
};

export const VUETIFY_XL_MAX_WIDTH = 1785;
export const VUETIFY_LG_MAX_WIDTH = 1185;
export const VUETIFY_MD_MAX_WIDTH = 900;
