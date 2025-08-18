import type { Schema, Struct } from '@strapi/strapi';

export interface MediasMedias extends Struct.ComponentSchema {
  collectionName: 'components_medias_medias';
  info: {
    displayName: 'medias';
    icon: 'play';
  };
  attributes: {};
}

export interface MediasProjetMedias extends Struct.ComponentSchema {
  collectionName: 'components_medias_projet_medias';
  info: {
    displayName: 'projet_medias';
    icon: 'apps';
  };
  attributes: {};
}

export interface MediasSlider extends Struct.ComponentSchema {
  collectionName: 'components_medias_sliders';
  info: {
    displayName: 'slider';
  };
  attributes: {
    legende: Schema.Attribute.String;
    medias: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    url_video: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'medias.medias': MediasMedias;
      'medias.projet-medias': MediasProjetMedias;
      'medias.slider': MediasSlider;
    }
  }
}
