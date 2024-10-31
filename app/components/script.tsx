type ScriptProps = {
  content: string
}

export function Script({ content }: ScriptProps) {
  return (
    <script
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}
