import React, {useState, useMemo, useEffect, Component, useCallback} from 'react'
import { Slate , Editable, withReact} from 'slate-react'
import { createEditor, Transforms, Editor,Text } from 'slate'
import Icon from 'react-icons-kit'
import {bold,italic, code, underline} from 'react-icons-kit/feather'
import './styles.css'

const CustomEditor = {
    isBoldMarkActive(editor){
        const [match] = Editor.nodes(editor, {
            match: n => n.bold === true,
            universal: true,
            
        })
        return !!match
    },
    isItalicMarkActive(editor){
        const [match] = Editor.nodes(editor,{
          match: n => n.italic ===  true,  
        })
        return !!match
    },
    isUnderlineActive(editor){
        const [match] = Editor.nodes(editor,{
            match: n => n.format_underlined === true,
        })
        return !!match
    },
    isCodeBlockActive(editor){
        const [match] = Editor.nodes(editor,{
            match: n => n.type === 'code',
        })
        return !!match
    },

    toggleBoldMark(editor) {
        const isActive = CustomEditor.isBoldMarkActive(editor)
        Transforms.setNodes(
          editor,
          { bold: isActive ? null : true },
          { match: n => Text.isText(n), split: true }
        )
    },
    toogleItalicMark(editor) {
        const isActive = CustomEditor.isItalicMarkActive(editor)
        Transforms.setNodes(
            editor,
            {italic: isActive ? null : true},
            {match: n => Text.isText(n), split: true}
        )
    },
    toggleUnderlineMark(editor){
        const isActive = CustomEditor.isUnderlineActive(editor)
        Transforms.setNodes(
            editor,
            {underline: isActive ? null : true},
            {match: n => Text.isText(n),split: true}
        )
    },
    toggleCodeBlock(editor) {
        const isActive = CustomEditor.isCodeBlockActive(editor)
        Transforms.setNodes(
          editor,
          { type: isActive ? null : 'code' },
          { match: n => Editor.isBlock(editor, n) }
        )
    },
}



const TextEditor = () => {
    
    const editor = useMemo(() => withReact(createEditor()),[])

    const [value, setValue] = useState([
            {
                type:'paragraph',
                children:[{ text: 'Uma linha de texto e um paragrafo'}],
            },
        ])   
    
    const renderElement = useCallback(props => {
        switch(props.element.type){
            case 'code':
                return <CodeElement {...props} />
            default:
                return <DefaultElement {...props} />
        }
    },[])

    const renderLeaf = useCallback(props => {
        return <Leaf {...props} />
    },[])

    
    
        return(
            <div className="container">
            <Slate editor={editor} value={value} onChange={newValue => setValue(newValue)} >
                <div className="buttonTools">
                    <button onMouseDown={event => {
                        event.preventDefault()
                        CustomEditor.toggleBoldMark(editor)
                        
                    }}className="tool-icon-button"><Icon icon={bold} /></button>

                    <button onMouseDown={event => {
                        event.preventDefault()
                        CustomEditor.toogleItalicMark(editor)
                        
                    }}className="tool-icon-button"><Icon icon={italic} /></button>

                    <button onMouseDown={event => {
                        event.preventDefault()
                        CustomEditor.toggleUnderlineMark(editor)
                        
                        
                    }} className="tool-icon-button"><Icon icon={underline} /></button>

                    <button onMouseDown={event => {
                        event.preventDefault()
                        CustomEditor.toggleCodeBlock(editor)
                        
                        
                    }} className="tool-icon-button"><Icon icon={code} /></button>
                </div>
                <div className="textArea">
                <Editable 
                renderElement={renderElement}
                renderLeaf={renderLeaf}
                onKeyDown={event =>{
                    if(!event.ctrlKey){
                        return
                        }

                        switch (event.key){
                            case '`' : {
                                event.preventDefault()
                                CustomEditor.toggleCodeBlock(editor)
                                break
                                }                          

                            case 'b': {
                                event.preventDefault()
                                CustomEditor.toggleBoldMark(editor)
                                break
                            }
                            case 'i': {
                                event.preventDefault()
                                CustomEditor.toogleItalicMark(editor)
                                break
                            }
                            case 'u': {
                                event.preventDefault()
                                CustomEditor.toggleUnderlineMark(editor)
                            }
                        }         
                }}
                />
                </div>
            </Slate>
            </div>

        )
    
}

const Leaf = props => {
    return(
        <span {...props.attributes} 
        style={{
            fontWeight: props.leaf.bold ? 'bold' : 'normal',
            fontStyle: props.leaf.italic ? 'italic' : 'normal',
            textDecorationLine: props.leaf.underline ? 'underline' : 'normal'
            }}>
            {props.children}
        </span>
    )
}

const CodeElement = props =>{
    return(
        <pre {...props.attributes}>
            <code>{props.children}</code>
        </pre>
    )
}

const DefaultElement = props =>{
    return <p {...props.attributes}>{props.children}</p>
}

export default TextEditor