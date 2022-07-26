import * as Yup from 'yup';

export const STATUS = {
  LIVE: 'live',
  CREATED: 'created'
};

export const getInitialValues = (values) => ({
  title: values?.title || '',
  description: values?.description || '',
  image: values?.image || '',
  type: values?.type || 'sku',
  items: values?.items || [],
  status: values?.status || STATUS.CREATED
});

export const schema = Yup.object()
  .shape({
    title: Yup.string().nullable(),
    description: Yup.string().nullable(),
    items: Yup.array().nullable()
  });

const url = 'https://profile.windo.live/sellerTemplateGallery/';
export const defaultItems = [
  {
    title: 'Jewellery',
    items: [
      {
        title: 'Title Your Banner Here',
        description: 'Make your banner text crisp, catchy and concise',
        image: `${url}je-1.original.jpg`
      },
      {
        title: 'Title Your Banner Here',
        description: 'Make your banner text crisp, catchy and concise',
        image: `${url}je-2.original.jpg`
      },
      {
        title: 'Title Your Banner Here',
        description: 'Make your banner text crisp, catchy and concise',
        image: `${url}je-3.original.jpg`
      },
      {
        title: 'Title Your Banner Here',
        description: 'Make your banner text crisp, catchy and concise',
        image: `${url}je-4.original.jpg`
      },
    ]
  },
  {
    title: 'Food',
    items: [
      {
        title: 'Title Your Banner Here',
        description: 'Make your banner text crisp, catchy and concise',
        image: `${url}food-1.original.jpg`
      },
      {
        title: 'Title Your Banner Here',
        description: 'Make your banner text crisp, catchy and concise',
        image: `${url}food-2.original.jpg`
      },
      {
        title: 'Title Your Banner Here',
        description: 'Make your banner text crisp, catchy and concise',
        image: `${url}food-3.original.jpg`
      },
      {
        title: 'Title Your Banner Here',
        description: 'Make your banner text crisp, catchy and concise',
        image: `${url}food-4.original.jpg`
      },
    ]
  },
  {
    title: 'Hand Crafts',
    items: [
      {
        title: 'Title Your Banner Here',
        description: 'Make your banner text crisp, catchy and concise',
        image: `${url}hc-1.original.jpg`
      },
      {
        title: 'Title Your Banner Here',
        description: 'Make your banner text crisp, catchy and concise',
        image: `${url}hc-2.original.jpg`
      },
      {
        title: 'Title Your Banner Here',
        description: 'Make your banner text crisp, catchy and concise',
        image: `${url}hc-3.original.jpg`
      },
      {
        title: 'Title Your Banner Here',
        description: 'Make your banner text crisp, catchy and concise',
        image: `${url}hc-4.original.jpg`
      },
    ]
  },
  {
    title: 'Abstract',
    items: [
      {
        title: 'Title Your Banner Here',
        description: 'Make your banner text crisp, catchy and concise',
        image: `${url}abs-1.original.jpg`
      },
      {
        title: 'Title Your Banner Here',
        description: 'Make your banner text crisp, catchy and concise',
        image: `${url}abs-2.original.jpg`
      },
      {
        title: 'Title Your Banner Here',
        description: 'Make your banner text crisp, catchy and concise',
        image: `${url}abs-3.original.jpg`
      },
      {
        title: 'Title Your Banner Here',
        description: 'Make your banner text crisp, catchy and concise',
        image: `${url}abs-4.original.jpg`
      }
    ]
  },
  {
    title: 'Clothing',
    items: [
      {
        title: 'Title Your Banner Here',
        description: 'Make your banner text crisp, catchy and concise',
        image: `${url}cl-1.original.jpg`
      },
      {
        title: 'Title Your Banner Here',
        description: 'Make your banner text crisp, catchy and concise',
        image: `${url}cl-2.original.jpg`
      },
      {
        title: 'Title Your Banner Here',
        description: 'Make your banner text crisp, catchy and concise',
        image: `${url}cl-3.original.jpg`
      },
      {
        title: 'Title Your Banner Here',
        description: 'Make your banner text crisp, catchy and concise',
        image: `${url}cl-4.original.jpg`
      },
    ]
  },
];
