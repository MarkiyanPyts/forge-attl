import ForgeUI, { render, Text, ContentAction, ModalDialog, useState, Fragment, useProductContext, ButtonSet, Button } from '@forge/ui';
import api, { route } from "@forge/api";

const fetchCommentsForContent = async (contentId) => {
  const res = await api
    .asUser()
    .requestConfluence(route`/wiki/rest/api/content/${contentId}/child/comment`);

  const data = await res.json();
  return data.results;
};

const fetchPageContent = async (contentId) => {
  const res = await api
    .asUser()
    .requestConfluence(route`/wiki/api/v2/pages/${contentId}?body-format=storage`);

  const data = await res.json();
  console.log("data", data)
  return data;
};

const testF = () => {
  console.log("hio")
}

const updatePageContent = async (contentId) => {
  console.log("contentId", contentId)

  const res = await api
    .asUser()
    .requestConfluence(route`/wiki/api/v2/pages/${contentId}?body-format=storage`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "page",
        status: "current",
        id: contentId,
        title: "My new page",
        version: {
          number: 2,
          message: "<string>"
        },
        body: {
          storage: {
            value: "<p>My new page content</p>",
            representation: "storage",
          },
        },
      })
    });

  const data = await res.json();
  console.log("data", data)
  return data;
};

const App = () => {
  const context = useProductContext();
  const [isOpen, setOpen] = useState(true);

  //const contEX = useState(async () => await fetchPageContent(context.contentId));

  //console.log(`Number of comments on this page2: ${contEX}`);
  useState(async () => await fetchPageContent(context.contentId));
  const myVar = process.env.MARK_KEY

  if (!isOpen) {
    return null;
  }

  return (
    <ModalDialog header="Hello" onClose={() => setOpen(false)}>
      <Text>Hello world! from mark 32345:{myVar}</Text>

      <ButtonSet>
        <Button text="Allow" onClick={() => {
          updatePageContent(context.contentId)
        }} />
        <Button text="Deny" onClick={testF} />
      </ButtonSet>
    </ModalDialog>
  );
};

export const run = render(
  <ContentAction>
    <App/>
  </ContentAction>
);
