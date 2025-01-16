import style from "./delete-module-confirm.module.css"
import {confirmDeleteModule, cancelDeleteModule} from "./modulesSlice"
import {useDispatch, useSelector} from "react-redux"

export default function DeleteModuleConfirm() {
	const deletedModule = useSelector(state => state.modules.deletedModule)
	const dispatch = useDispatch()

	if (deletedModule != null) return (<div className={style.darkness}>
		<div className={style.popup}>
			<p className={style.text}>Вы действительно хотите удалить модуль <span>{deletedModule.name}</span>?</p>
			<div className={style.buttonsWrapper}>
				<button onClick={() => dispatch(confirmDeleteModule())} className={"main-page_button"}>Да</button>
				<button onClick={() => dispatch(cancelDeleteModule())} className={"main-page_button"}>Нет</button>	
			</div>
		</div>
	</div>)
}