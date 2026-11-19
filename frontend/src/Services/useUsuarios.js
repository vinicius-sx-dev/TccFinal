import { create } from 'zustand';
import {
  storeToken,
  getToken,
  removeToken
} from './authStorage';

import { Platform } from 'react-native';

import api from './api';

const baseUrl = 'https://reni-3d-app.onrender.com/usuarios'

const useUsuarios = create((set, get) => ({

  alteraUsuario: async (nome, curso) => {
    console.log(nome, curso)

    try {
      const response = await api.put(`${baseUrl}/perfil`, {
        "nome": nome,
        "curso": curso
      }
      );

      const answer = await response;

      if (answer) {
        return true;
      }

    } catch (error) {
      console.error('Erro ao alterar usuário:', error);
    }
  },


  enviaAvatar: async (foto) => {
    try {
      const formData = new FormData();

      formData.append('foto', {
        uri: foto.uri,
        type: foto.mimeType || 'image/jpeg',
        name: foto.fileName || 'avatar.jpg',
      });

      const response = await api.post(`${baseUrl}/avatar`, formData);

      if (response.data) {
        return true;
      }
    } catch (error) {
      console.error('Erro ao enviar avatar:', error);
    }
  }





}));

export default useUsuarios


export {
  baseUrl
};