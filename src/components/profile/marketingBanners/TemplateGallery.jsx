import React, { useState } from 'react';
import { useToggle } from 'hooks/common';
import { defaultItems } from './utils';
import { Card } from './Card';
import Form from './Form';
import styles from './TemplateGallery.module.css';

export function TemplateGallery() {
  const [open, close] = useToggle(false);
  const [selected, setSelected] = useState(null);
  return (
    <div className={styles.section}>
      {open && <Form values={selected} onClose={close} />}
      <div className={styles.head}>
        Template Gallery
      </div>
      <div className={styles.body}>
        {defaultItems.map(x => (
          <div className={styles.relative}>
            <div className={styles.label}>
              {x.title}
            </div>
            <div className={styles.single}>
              {x.items.map(y => (
                <Card
                  title={y.title}
                  description={y.description}
                  image={y.image}
                  showEdit={true}
                  onClick={() => {
                    setSelected({ image: y.image, title: '', description: '' });
                    close();
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

TemplateGallery.propTypes = {};

TemplateGallery.defaultProps = {};
