import React, { useState, useEffect } from "react";

import Toast from 'react-native-toast-message'

import { Text, View, Image, TouchableOpacity, TextInput, ActivityIndicator } from "react-native";

import styles from "./styles";

import * as ImagePicker from "expo-image-picker";

import autenticacao from "../../Services/autenticacao";
import useUsuarios from "../../Services/useUsuarios";

import user from '../../../assets/user.png'

import BotaoMenu from "../../Reutilizaveis/BotaoMenu";
import Menu from "../../Reutilizaveis/Menu";

import navegacaoMenu from "../../Services/navegacaoMenu";

export default function BackDoor({ navigation }) {

  const usuario = autenticacao((state) => state.usuario);
  const consultarUsuario = autenticacao((state) => state.consultarUsuario);
  const foto = autenticacao((state) => state.foto);

  const alteraUsuario = useUsuarios((state) => state.alteraUsuario);
  const enviaAvatar = useUsuarios((state) => state.enviaAvatar);
  const mostraMenu = navegacaoMenu((state) => state.mostraMenu);
  const iniciaMenu = navegacaoMenu((state) => state.iniciaMenu);

  useEffect(() => {
    if (iniciaMenu) {
      iniciaMenu();
    }
  }, [iniciaMenu])

  const altera = async (nome, curso) => {
    if (!nome || !curso) {
      console.log("Faltam parâmetros");
      return;
    }
    if (!alteraUsuario) {
      console.log("Função não carregada");
      return;
    }

    const alterou = await alteraUsuario(nome, curso);

    if (!alterou) {
      console.log("Erro ao alterar usuário")
      return;
    }

    console.log("Usuário alterado com sucesso")
    return true;

  }

  const mostraPop = async (nome, curso) => {
    const mostra = await altera(nome, curso);
    console.log(mostra)
    if (mostra) {
      Toast.show({
        type: "success",
        text1: "Usuário alterado com sucesso!",
        visibilityTime: 3000
      })
    }
  }

  const [nome, setNome] = useState("");
  const [curso, setCurso] = useState("");
  const [carrega, setCarrega] = useState(false)


  useEffect(() => {
    console.log("Consultando usuario")
    if (consultarUsuario) {
      consultarUsuario();
    }
  }, [consultarUsuario])

  const setaUsuario = () => {
    if (usuario) {
      setNome(usuario.nome);
      setCurso(usuario.curso);
      setCarrega(true)
    }
  }

  useEffect(() => {
    if (usuario != null) {
      setaUsuario();
    }

  }, [usuario])

  const [
    enviandoArquivo,
    setEnviandoArquivo
  ] = useState(false);


  const selecionaMidias = async () => {

    try {

      const permissao =
        await ImagePicker
          .requestMediaLibraryPermissionsAsync();


      if (!permissao.granted) {

        Toast.show({

          type: "error",

          text1: "Permissão negada",

          text2:
            "Permita o acesso à galeria.",

          visibilityTime: 3000

        });

        return;
      }


      const resultado =
        await ImagePicker
          .launchImageLibraryAsync({

            mediaTypes: [
              "images",
            ],

            allowsMultipleSelection: false,

            quality: 0.8

          });


      if (resultado.canceled) {
        return;
      }


      const arquivos =
        resultado.assets;


      if (
        !arquivos ||
        arquivos.length === 0
      ) {
        return;
      }


      setEnviandoArquivo(true);

      let sucesso = true;


      for (
        const arquivo of arquivos
      ) {

        const enviado =
          await enviaAvatar(
            arquivo
          );


        if (!enviado) {

          sucesso = false;

          break;

        }

      }


      if (sucesso) {
        consultarUsuario()

        Toast.show({

          type: "success",

          text1:
            "Mídias enviadas com sucesso!",

          text2:
            `${arquivos.length} arquivo(s) enviado(s).`,

          visibilityTime: 3000

        });

      } else {

        Toast.show({

          type: "error",

          text1:
            "Erro ao enviar mídia",

          visibilityTime: 3000

        });

      }

    } catch (error) {

      console.error(
        "Erro ao selecionar mídias:",
        error
      );


      Toast.show({

        type: "error",

        text1:
          "Erro ao selecionar mídia",

        visibilityTime: 3000

      });

    } finally {

      setEnviandoArquivo(false);

    }

  };


  return <>

    {nome && curso && foto && carrega ?
      <>
        <BotaoMenu />
        <Menu
          navigation={navigation}
        />
        <View style={styles.fundo}>

          <View style={styles.cabecalho}>

            <View style={styles.titulo}>
              <Text style={styles.saudacao}>Minha Conta</Text>

              <Text style={styles.descricao}>Altere seu nome, curso e foto de perfil no catálogo principal</Text>
            </View>

            {
              foto ?
                <>
                  <TouchableOpacity
                  onPress={() => {
                    selecionaMidias()
                  }}
                  >
                    <Image
                      source={{ uri: foto }}
                      style={styles.fotoPerfil}
                    />
                  </TouchableOpacity>

                </>
                :
                <>
                  <Image
                    source={user}
                    style={styles.fotoPerfil}
                  />
                </>

            }


            <View style={styles.subTitulo}>
              <View style={styles.containerInput}>
                <TextInput
                  value={nome}
                  onChangeText={setNome}
                  placeholder="Nome*"
                  style={styles.input}
                  editable={mostraMenu ? false : true}
                />
              </View>

              <View style={styles.containerInput}>
                <TextInput
                  value={curso}
                  onChangeText={setCurso}
                  placeholder="Curso*"
                  style={styles.input}
                  editable={mostraMenu ? false : true}
                />
              </View>


              <View style={styles.containerInput}>
                <Text style={[styles.input, styles.matricula]}>{usuario?.matricula}</Text>
              </View>


            </View>



            <View>
              <TouchableOpacity style={styles.botao}
                onPress={() => {
                  mostraPop(nome, curso)
                }}
              >
                <Text style={styles.textoBotao}>Salvar Perfil</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </>
      :
      <>
        <ActivityIndicator
          size="large"
          color="#00000"
          style={styles.loader}
        />
      </>
    }
    <>

    </>

  </>
}
