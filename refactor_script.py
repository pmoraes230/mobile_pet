from pathlib import Path
import shutil

root = Path(r"c:\mobile pet patrick\mobile_pet")
src = root / 'src'
for d in ['pages', 'services', 'hooks', 'utils', 'constants']:
    p = src / d
    p.mkdir(parents=True, exist_ok=True)
    (p / '.gitkeep').write_text('', encoding='utf-8')

pages = {
    'adocao.js': ('Adocao', 'adocaostyle.js'),
    'agendamento.js': ('Agendamento', 'agendamentoStyle.js'),
    'anunciarpet.js': ('AnunciarPet', 'anunciarpetstyle.js'),
    'chatprivado.js': ('ChatPrivado', 'chatprivadostyle.js'),
    'configuracoes.js': ('Configuracoes', 'configuracoesstyle.js'),
    'cupidopet.js': ('CupidoPet', 'cupidopetstyle.js'),
    'detalhespet.js': ('DetalhesPet', 'detalhespetstyle.js'),
    'diario.js': ('Diario', 'diariostyle.js'),
    'editarperfil.js': ('EditarPerfil', 'editarperfilstyle.js'),
    'index.js': ('Index', 'indexStyle.js'),
    'loginApp.js': ('LoginApp', None),
    'mensagens.js': ('Mensagens', 'mensagensstyle.js'),
    'meuspets.js': ('MeusPets', 'petstyle.js'),
    'novoagendamento.js': ('NovoAgendamento', 'novoagendamentostyle.js'),
    'perfil.js': ('Perfil', 'perfilstyle.js'),
    'petDetail.js': ('PetDetail', 'petDetailStyle.js'),
    'prontuario.js': ('Prontuario', 'prontuariostyle.js'),
    'responsavelcadastro.js': ('ResponsavelCadastro', 'responsavelcadastrostyle.js'),
    'responsavellogin.js': ('ResponsavelLogin', 'responsavelloginstyle.js'),
    'spleshApp.js': ('SplashApp', None),
    'telainicial.js': ('TelaInicial', 'telainicialstyle.js'),
}
for old, (new_name, style_name) in pages.items():
    old_path = src / 'screens' / old
    if old_path.exists():
        dest_dir = src / 'pages' / new_name
        dest_dir.mkdir(parents=True, exist_ok=True)
        shutil.move(str(old_path), str(dest_dir / f'{new_name}.js'))
        if style_name:
            style_src = src / 'style' / style_name
            if style_src.exists():
                shutil.move(str(style_src), str(dest_dir / 'styles.js'))
            else:
                print('Style missing', style_src)
    else:
        print('Screen missing', old_path)

components = {
    'buttomLogin.js': ('ButtonLogin', 'ButtonLogin.js'),
    'inputEmail.js': ('InputEmail', 'InputEmail.js'),
}
for old, (new_folder, new_file) in components.items():
    old_path = src / 'components'
    if (old_path / 'buttons' / old).exists():
        src_path = old_path / 'buttons' / old
    elif (old_path / 'inputs' / old).exists():
        src_path = old_path / 'inputs' / old
    else:
        print('Component missing', old)
        continue
    dest_dir = old_path / new_folder
    dest_dir.mkdir(parents=True, exist_ok=True)
    shutil.move(str(src_path), str(dest_dir / new_file))

component_moves = [
    ('Header', 'HeaderHome', 'HeaderHome.js', 'headerHomeStyle.js'),
    ('TabBar', 'TabBar', 'TabBar.js', 'tabBarStyle.js'),
    ('Sidebar', 'Sidebar', 'Sidebar.js', 'sidebarStyle.js'),
]
for old_dir, new_dir, filename, style_name in component_moves:
    old_folder = src / 'components' / old_dir
    if old_folder.exists():
        new_folder = src / 'components' / new_dir
        new_folder.mkdir(parents=True, exist_ok=True)
        old_file = old_folder / filename
        if old_file.exists():
            shutil.move(str(old_file), str(new_folder / filename))
        style_file = old_folder / style_name
        if style_file.exists():
            shutil.move(str(style_file), str(new_folder / 'styles.js'))
        try:
            old_folder.rmdir()
        except OSError:
            pass
    else:
        print('Component folder missing', old_folder)

for d in ['buttons', 'inputs']:
    folder = src / 'components' / d
    if folder.exists():
        try:
            folder.rmdir()
        except OSError:
            pass

style_dir = src / 'style'
if style_dir.exists():
    try:
        style_dir.rmdir()
    except OSError:
        pass

component_index = {
    'HeaderHome': 'HeaderHome',
    'TabBar': 'TabBar',
    'Sidebar': 'Sidebar',
    'ButtonLogin': 'ButtonLogin',
    'InputEmail': 'InputEmail',
}
for folder, comp in component_index.items():
    path = src / 'components' / folder / 'index.js'
    path.write_text(f"export {{ default }} from './{comp}.js';\n", encoding='utf-8')

button_login_style = '''import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    buttonContainer: {
        backgroundColor: "#573F94",
        borderColor: "#ffffff",
        borderWidth: 1,
        borderRadius: 5,
        paddingVertical: 10,
    },
    buttonText: {
        color: "#ffffff",
        fontSize: 16,
        textAlign: "center",
    }
});
'''
input_email_style = '''import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        width: "100%",
        marginBottom: 15,
        backgroundColor: "#ffffff",
        borderRadius: 16,
    },
    input: {
        height: 50,
        paddingHorizontal: 15,
        fontSize: 16,
        color: "#333",
    },
    inputFocused: {
        borderColor: "#FFCB00",
        borderWidth: 2,
        borderRadius: 16,
    },
    inputError: {
        borderColor: "red",
        borderWidth: 2,
        borderRadius: 16,
    },
});
'''
(src / 'components' / 'ButtonLogin' / 'styles.js').write_text(button_login_style, encoding='utf-8')
(src / 'components' / 'InputEmail' / 'styles.js').write_text(input_email_style, encoding='utf-8')

# Update App.js imports to new page locations
app_path = root / 'App.js'
app_text = app_path.read_text(encoding='utf-8')
update_map = {
    './src/screens/responsavellogin': './src/pages/ResponsavelLogin/ResponsavelLogin',
    './src/screens/responsavelcadastro': './src/pages/ResponsavelCadastro/ResponsavelCadastro',
    './src/screens/spleshApp': './src/pages/SplashApp/SplashApp',
    './src/screens/telainicial': './src/pages/TelaInicial/TelaInicial',
    './src/screens/mensagens': './src/pages/Mensagens/Mensagens',
    './src/screens/agendamento': './src/pages/Agendamento/Agendamento',
    './src/screens/diario': './src/pages/Diario/Diario',
    './src/screens/meuspets': './src/pages/MeusPets/MeusPets',
    './src/screens/prontuario': './src/pages/Prontuario/Prontuario',
    './src/screens/cupidopet': './src/pages/CupidoPet/CupidoPet',
    './src/screens/adocao': './src/pages/Adocao/Adocao',
    './src/screens/configuracoes': './src/pages/Configuracoes/Configuracoes',
    './src/screens/perfil': './src/pages/Perfil/Perfil',
    './src/screens/editarperfil': './src/pages/EditarPerfil/EditarPerfil',
    './src/screens/petDetail': './src/pages/PetDetail/PetDetail',
    './src/screens/detalhespet': './src/pages/DetalhesPet/DetalhesPet',
    './src/screens/chatprivado': './src/pages/ChatPrivado/ChatPrivado',
    './src/screens/novoagendamento': './src/pages/NovoAgendamento/NovoAgendamento',
    './src/screens/anunciarpet': './src/pages/AnunciarPet/AnunciarPet',
}
for old_path, new_path in update_map.items():
    app_text = app_text.replace(old_path, new_path)
app_path.write_text(app_text, encoding='utf-8')

# Fix remaining page imports and inline styles after move
from pathlib import Path
import re
for path in (src / 'pages').rglob('*.js'):
    text = path.read_text(encoding='utf-8')
    text = text.replace("from '../style/", "from './styles'")
    text = text.replace('from "../style/', 'from "./styles"')
    text = text.replace("from '../components/Header/HeaderHome'", "from '../../components/HeaderHome'")
    text = text.replace('from "../components/Header/HeaderHome"', 'from "../../components/HeaderHome"')
    text = text.replace("from '../components/TabBar/TabBar'", "from '../../components/TabBar'")
    text = text.replace('from "../components/TabBar/TabBar"', 'from "../../components/TabBar"')
    text = text.replace("from '../components/Sidebar/Sidebar'", "from '../../components/Sidebar'")
    text = text.replace('from "../components/Sidebar/Sidebar"', 'from "../../components/Sidebar"')
    text = text.replace("from '../components/inputs/inputEmail'", "from '../../components/InputEmail'")
    text = text.replace('from "../components/inputs/inputEmail"', 'from "../../components/InputEmail"')
    text = text.replace("require('../assets/", "require('../../assets/")
    text = text.replace('require("../assets/', 'require("../../assets/')
    if path.name == 'Index.js':
        text = text.replace("from './src/style/indexStyle'", "from './styles'")
    if path.name == 'LoginApp.js':
        text = text.replace('import { View, Text, StyleSheet, Image } from "react-native";', 'import { View, Text, Image } from "react-native";\nimport { styles } from "./styles";')
        text = re.sub(r'\nconst styles = StyleSheet\.create\([\s\S]*?\)\s*$', '', text, flags=re.MULTILINE)
    if path.name == 'SplashApp.js':
        text = text.replace('import { useEffect } from "react";\nimport { View, StyleSheet, Image } from "react-native";', 'import { useEffect } from "react";\nimport { View, Image } from "react-native";\nimport { styles } from "./styles";')
        text = re.sub(r'\nconst styles = StyleSheet\.create\([\s\S]*?\)\s*$', '', text, flags=re.MULTILINE)
    path.write_text(text, encoding='utf-8')

# Fix component internal style imports and exports
for path in [src / 'components' / 'HeaderHome' / 'HeaderHome.js', src / 'components' / 'TabBar' / 'TabBar.js', src / 'components' / 'Sidebar' / 'Sidebar.js']:
    text = path.read_text(encoding='utf-8')
    text = text.replace("from './headerHomeStyle'", "from './styles'")
    text = text.replace("from './tabBarStyle'", "from './styles'")
    text = text.replace("from './sidebarStyle'", "from './styles'")
    path.write_text(text, encoding='utf-8')

# Update component files to use local styles modules
btn_path = src / 'components' / 'ButtonLogin' / 'ButtonLogin.js'
btn_text = btn_path.read_text(encoding='utf-8')
btn_text = btn_text.replace('import { TouchableOpacity, Text } from "react-native";', 'import { TouchableOpacity, Text } from "react-native";\nimport { styles } from "./styles";')
if 'export default function ButtonLogin' not in btn_text:
    btn_text = btn_text.replace('export const buttonLogin = ({ onPress, title }) => {', 'export default function ButtonLogin({ onPress, title }) {')
btn_path.write_text(btn_text, encoding='utf-8')

input_path = src / 'components' / 'InputEmail' / 'InputEmail.js'
input_text = input_path.read_text(encoding='utf-8')
input_text = input_text.replace('import { View, TextInput, Text } from "react-native";', 'import { View, TextInput, Text } from "react-native";\nimport { styles } from "./styles";')
if 'export default InputEmail' not in input_text:
    if 'export function InputEmail' not in input_text:
        input_text = input_text.replace('export const InputEmail = ({ value, onChangeText, error }) => {', 'export function InputEmail({ value, onChangeText, error }) {')
    input_text += '\n\nexport default InputEmail;\n'
input_path.write_text(input_text, encoding='utf-8')

# Correct component index exports for InputEmail
(src / 'components' / 'InputEmail' / 'index.js').write_text("export { InputEmail, default } from './InputEmail.js';\n", encoding='utf-8')

print('Moves complete with import fixes')
