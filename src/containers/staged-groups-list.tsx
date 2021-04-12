import React, { FC } from "react"
import * as O from "fp-ts/lib/Option"
import { formatStagedBookmarksGroupTitle } from "~/modules/bookmarks"
import { useDispatch, useSelector } from "~/store"
import { setPage } from "~/store/user/actions"
import { getSortedStagedGroups } from "~/store/selectors"
import { setStagedBookmarksGroupEditId } from "~/store/bookmarks/actions"
import styled from "~/styles"
import { Page } from "~/store/user/types"
import ListItem from "~/components/list-item"

const Wrapper = styled.ol`
  list-style: none;
  padding: 0;
`

const GroupTitle = styled.header`
  margin: 0.5rem 0;
`

const Message = styled.p`
  padding: 0 1rem;
  text-align: center;
`

const StagedGroupsList: FC = () => {
  const groups = useSelector(getSortedStagedGroups)
  const dispatch = useDispatch()

  const handleGroupClick = (id: number): void => {
    dispatch(setStagedBookmarksGroupEditId(O.some(id)))
    dispatch(setPage(Page.StagedGroup))
  }

  return (
    <Wrapper>
      {groups.length ? (
        groups.map(grp => (
          <ListItem key={grp.id} onClick={(): void => handleGroupClick(grp.id)}>
            <GroupTitle>{formatStagedBookmarksGroupTitle(grp)}</GroupTitle>
          </ListItem>
        ))
      ) : (
        <Message>There are no groups in the staging area.</Message>
      )}
    </Wrapper>
  )
}

export default StagedGroupsList
