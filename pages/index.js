import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { useState, useRef, useEffect } from 'react';

function AutoTextArea(props) {
  const textAreaRef = useRef(null);

  useEffect(() => {
    textAreaRef.current.style.height = 'auto';
    textAreaRef.current.style.height = textAreaRef.current.scrollHeight + 'px';
  }, []);

  return (
    <textarea
      ref={textAreaRef}
      onInput={() => {
        textAreaRef.current.style.height = 'auto';
        textAreaRef.current.style.height =
          textAreaRef.current.scrollHeight + 10 + 'px';
      }}
      {...props}
    />
  );
}

export default function Landing() {
  const [output, setOutput] = useState('');
  const [input, setInput] = useState(undefined);

  function handleConvert() {
    if (input) {
      try {
        setOutput(generateSQL(JSON.parse(input)));
      } catch (err) {
        console.error('PB2SQL:', err);
        setOutput('Invaild');
      }
      setInput(null);
    } else {
    }
  }

  function generateSQL(json) {
    const tables = [];
    for (const collection of json) {
      const fields = ['id INT NOT NULL'];
      const foreignKeys = [];
      for (const field of collection.schema) {
        const type =
          field.type === 'text'
            ? 'VARCHAR(255)'
            : field.type === 'bool'
            ? 'TINYINT'
            : field.type === 'file'
            ? 'VARCHAR(255)'
            : field.type === 'editor'
            ? 'VARCHAR(255)'
            : field.type === 'select'
            ? 'VARCHAR(255)'
            : field.type === 'url'
            ? 'VARCHAR(2083)'
            : field.type === 'relation'
            ? 'INT'
            : field.type === 'date'
            ? 'DATETIME'
            : field.type === 'json'
            ? 'LONGTEXT'
            : field.type === 'number'
            ? 'INT'
            : '';
        const constraints = [];
        if (field.required) {
          constraints.push('NOT NULL');
        }
        if (field.unique) {
          constraints.push('UNIQUE');
        }
        fields.push(`${field.name} ${type} ${constraints.join(' ')}`);
        if (field.type === 'relation') {
          const matchingObject = json.find(
            (obj) => obj.id == field.options.collectionId
          );
          foreignKeys.push(
            `FOREIGN KEY (${field.name}) REFERENCES ${matchingObject.name}(id)`
          );
        }
      }
      var createTable = `CREATE TABLE ${collection.name} (\n  ${fields.join(
        ',\n  '
      )}, \n  PRIMARY KEY (id)`;
      if (foreignKeys.length > 0) {
        createTable += `,\n  ${foreignKeys.join(',\n  ')}`;
      }
      createTable += '\n);';
      tables.push(createTable);
    }
    return tables.join('\n\n');
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to{' '}
          <a href="https://github.com/DontFred">PocketBase Schema to SQL!</a>
        </h1>

        <p className={styles.description}>
          Get started by inserting your
          <code className={styles.code}>PocketBase Schema Array</code>
        </p>

        <div
          style={{
            maxWidth: '800px',
            margin: 'auto',
          }}
        >
          <AutoTextArea
            value={input}
            onChange={(inputV) => setInput(inputV.target.value)}
            placeholder="PocketBase Schema"
            className={styles.card}
            style={{ resize: 'none', width: '80vw', maxWidth: '800px' }}
          />
        </div>
        <button
          className={styles.card}
          style={{
            background: '#0070f3',
            fontSize: '1.5em',
            padding: '15px',
            fontWeight: 'bold',
            color: 'white',
            cursor: 'pointer',
          }}
          onClick={handleConvert}
        >
          Convert
        </button>
        <div
          style={{
            maxWidth: '800px',
            margin: 'auto',
          }}
        >
          <AutoTextArea
            value={output || null}
            readOnly
            placeholder="SQL Output"
            className={styles.card}
            style={{ resize: 'none', width: '80vw', maxWidth: '800px' }}
          />
        </div>
        <div
          className={styles.grid}
          style={{
            width: 800,
          }}
        >
          <a
            href="https://github.com/vercel/next.js/tree/master/examples"
            className={styles.card}
            style={{
              width: '320px !important',
            }}
          >
            <h3>Github &rarr;</h3>
            <p>Find my other projects and my LinkedIn.</p>
          </a>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://github.com/DontFred"
          target="_blank"
          rel="noopener noreferrer"
        >
          Created by&nbsp;<b>@DontFred</b>&nbsp;🖤
        </a>
      </footer>
    </div>
  );
}
